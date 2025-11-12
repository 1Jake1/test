import { OAuthConfig, OAuthUserConfig } from 'next-auth/providers';
import User from '../models/User';
import connectDB from './mongodb';

export interface SSOProfile {
	id: string;
	email: string;
	name: string;
	first_name?: string;
	last_name?: string;
	role: string;
	department?: string;
	company?: string;
	picture?: string;
	email_verified: boolean;
}

export default function SSOProvider<P extends SSOProfile>(
	options: OAuthUserConfig<P>
): OAuthConfig<P> {
	return {
		id: 'sso',
		name: 'SSO',
		type: 'oauth',
		version: '2.0',
		authorization: {
			url: `${process.env.SSO_BASE_URL}/oauth/authorize`,
		},
		token: {
			url: `${process.env.SSO_BASE_URL}/oauth/token`,
			async request(context) {
				try {
					const response = await fetch(
						`${process.env.SSO_BASE_URL}/oauth/token`,
						{
							method: 'POST',
							headers: {
								'Content-Type': 'application/x-www-form-urlencoded',
							},
							body: new URLSearchParams({
								grant_type: 'authorization_code',
								client_id: options.clientId!,
								client_secret: options.clientSecret!,
								code: context.params.code!,
								redirect_uri: process.env.SSO_REDIRECT_URI!,
							}),
						}
					);

					const tokens = await response.json();

					if (!response.ok) {
						throw new Error(`SSO token error: ${tokens.error}`);
					}

					return { tokens };
				} catch (error) {
					console.error('Token request error:', error);
					throw error;
				}
			},
		},
		userinfo: {
			url: `${process.env.SSO_BASE_URL}/oauth/userinfo`,
			async request(context) {
				try {
					const response = await fetch(
						`${process.env.SSO_BASE_URL}/oauth/userinfo`,
						{
							headers: {
								Authorization: `Bearer ${context.tokens.access_token}`,
							},
						}
					);

					if (!response.ok) {
						throw new Error('Failed to fetch user info');
					}

					const profile = await response.json();
					return profile;
				} catch (error) {
					console.error('Userinfo request error:', error);
					throw error;
				}
			},
		},
		async profile(profile, tokens) {
			try {
				// Подключаемся к базе данных
				await connectDB();

				// Подготавливаем данные для поиска/создания пользователя
				const userProfile = {
					id: profile.sub || profile.id,
					email: profile.email,
					role: profile.role || 'user',
					department: profile.department,
				};

				// Ищем или создаем пользователя в MongoDB
				const user = await User.findOrCreate(userProfile);

				// Обновляем SSO данные
				user.ssoData = {
					accessToken: tokens.access_token!,
					refreshToken: tokens.refresh_token,
					tokenExpires: new Date(Date.now() + tokens.expires_in! * 1000),
					provider: 'sso',
				};

				await user.save();

				return {
					id: user._id.toString(),
					ssoId: user.ssoId,
					email: user.email,
					role: user.role,
					department: user.department,
					image: user.avatar,
				};
			} catch (error) {
				console.error('Profile processing error:', error);
				throw error;
			}
		},
		options,
	};
}
