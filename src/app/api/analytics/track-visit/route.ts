import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    await prisma.siteVisit.create({
      data: {
        page: data.page,
        referrer: data.referrer,
        userAgent: data.userAgent,
        ip: data.ip
      }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving visit:', error);
    return NextResponse.json(
      { error: 'Failed to save visit' },
      { status: 500 }
    );
  }
} 