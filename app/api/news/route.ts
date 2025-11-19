import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/db';
import { News } from '../../../models/News';

export async function GET() {
	await connectDB();
	const news = await News.find().sort({ createdAt: -1 });
	return NextResponse.json(news);
}

export async function POST(req: Request) {
	await connectDB();
	const data = await req.json();
	const news = await News.create(data);
	return NextResponse.json(news, { status: 201 });
}

export async function PUT(req: Request) {
	await connectDB();
	const { _id, ...update } = await req.json();
	const news = await News.findByIdAndUpdate(_id, update, { new: true });
	return NextResponse.json(news);
}

export async function DELETE(req: Request) {
	await connectDB();
	const { id } = await req.json();
	await News.findByIdAndDelete(id);
	return NextResponse.json({ success: true });
}

