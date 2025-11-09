import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/db';
import { User } from '../../../models/User';

export async function GET() {
	await connectDB();
	const users = await User.find().sort({ createdAt: -1 });
	return NextResponse.json(users);
}

export async function POST(req: Request) {
	await connectDB();
	const data = await req.json();
	const user = await User.create(data);
	return NextResponse.json(user, { status: 201 });
}

export async function PUT(req: Request) {
	await connectDB();
	const { _id, ...update } = await req.json();
	const user = await User.findByIdAndUpdate(_id, update, { new: true });
	return NextResponse.json(user);
}

export async function DELETE(req: Request) {
	await connectDB();
	const { id } = await req.json();
	await User.findByIdAndDelete(id);
	return NextResponse.json({ success: true });
}
