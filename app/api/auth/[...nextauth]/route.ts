import NextAuth from 'next-auth';
import { connectDB } from '../../../../lib/db';
import CustomAuthProvider from '../../../../lib/providers/sso-provider';
import { User } from '../../../../models/User';

export default NextAuth({
	providers: [
		CustomAuthProvider({
			clientId: process.env.SSO_CLIENT_ID!,
			clientSecret: process.env.SSO_CLIENT_SECRET!,
		}),
	],
	callbacks: {

		async jwt({ token, user, account, profile }) {
			// Первоначальный вход
			if (account && user) {
				token.userId = user.id;
				token.ssoId = user.ssoId;
				token.role = user.role;
				token.department = user.department;
				token.accessToken = account.access_token;
				token.refreshToken = account.refresh_token;
				token.accessTokenExpires = Date.now() + account.expires_in! * 1000;
			}

			// Возвращаем существующий токен если не истек
			if (Date.now() < token.accessTokenExpires) {
				return token;
			}

			// Обновляем токен если истек
			return refreshAccessToken(token);
		},
		async session({ session, token }) {
			try {
				await connectDB();

				// Получаем актуальные данные пользователя из MongoDB
				const user = await User.findById(token.userId);

				if (user) {
					session.user.id = user._id.toString();
					session.user.ssoId = user.ssoId;
					session.user.email = user.email;
					session.user.role = user.role;
					session.user.department = user.department;
					session.user.image = user.avatar;
					session.accessToken = token.accessToken;
					session.error = token.error;
				}

				return session;
			} catch (error) {
				console.error('Session callback error:', error);
				session.error = 'DatabaseError';
				return session;
			}
		},
	},
	events: {
		async signOut({ token }) {
			try {
				await connectDB();

				// Обновляем пользователя при выходе
				if (token.userId) {
					await User.findByIdAndUpdate(token.userId, {
						$unset: {
							'ssoData.accessToken': 1,
							'ssoData.refreshToken': 1,
						},
					});
				}

				// Отзываем токен на стороне SSO провайдера
				if (token.accessToken) {
					await fetch(`${process.env.SSO_BASE_URL}/oauth/revoke`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
						},
						body: new URLSearchParams({
							token: token.accessToken as string,
							client_id: process.env.SSO_CLIENT_ID!,
							client_secret: process.env.SSO_CLIENT_SECRET!,
						}),
					});
				}
			} catch (error) {
				console.error('SignOut event error:', error);
			}
		},
	},
	pages: {
		signIn: '/auth/signin',
		error: '/auth/error',
	},
	session: {
		strategy: 'jwt',
		maxAge: 24 * 60 * 60, // 24 часа
	},
});

// Функция обновления токена
async function refreshAccessToken(token: any) {
	try {
		const response = await fetch(`${process.env.SSO_BASE_URL}/oauth/token`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: new URLSearchParams({
				grant_type: 'refresh_token',
				refresh_token: token.refreshToken,
				client_id: process.env.SSO_CLIENT_ID!,
				client_secret: process.env.SSO_CLIENT_SECRET!,
			}),
		});

		const refreshedTokens = await response.json();

		if (!response.ok) {
			throw refreshedTokens;
		}

		// Обновляем данные в MongoDB
		await connectDB();
		await User.findByIdAndUpdate(token.userId, {
			'ssoData.accessToken': refreshedTokens.access_token,
			'ssoData.refreshToken': refreshedTokens.refresh_token,
			'ssoData.tokenExpires': new Date(
				Date.now() + refreshedTokens.expires_in * 1000
			),
		});

		return {
			...token,
			accessToken: refreshedTokens.access_token,
			accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
			refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
		};
	} catch (error) {
		console.error('Error refreshing access token', error);

		return {
			...token,
			error: 'RefreshAccessTokenError',
		};
	}
}
