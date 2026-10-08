import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Category from '@/models/Category';

export async function GET(request: Request) {
  try {
    await connectDB();

    const categories = await Category.find().sort({ order: 1, name: 1 });
    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    
    // Auto-assign order if not provided
    if (body.order === undefined) {
      const lastCategory = await Category.findOne().sort({ order: -1 });
      body.order = lastCategory ? (lastCategory.order || 0) + 1 : 0;
    }

    const category = await Category.create(body);
    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ success: false, error: 'Failed to create category' }, { status: 500 });
  }
}
