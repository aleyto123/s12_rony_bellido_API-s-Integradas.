import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') ?? '';
    const genre = searchParams.get('genre') ?? undefined;
    const authorName = searchParams.get('authorName') ?? undefined;
    const page = Number(searchParams.get('page') ?? '1');
    const limit = Number(searchParams.get('limit') ?? '10');
    const sortBy = (searchParams.get('sortBy') as 'title' | 'publishedYear' | 'createdAt') ?? 'createdAt';
    const order = (searchParams.get('order') as 'asc' | 'desc') ?? 'desc';

    const safePage = Number.isFinite(page) && page > 0 ? page : 1;
    const safeLimit = Number.isFinite(limit) ? Math.min(Math.max(limit, 1), 50) : 10;
    const skip = (safePage - 1) * safeLimit;

    const where: any = {
      ...(search && {
        title: { contains: search, mode: 'insensitive' },
      }),
      ...(genre && { genre }),
      ...(authorName && {
        author: {
          name: { contains: authorName, mode: 'insensitive' },
        },
      }),
    };

    const [books, total] = await Promise.all([
      prisma.book.findMany({
        where,
        include: {
          author: true,
        },
        orderBy: {
          [sortBy]: order,
        },
        skip,
        take: safeLimit,
      }),
      prisma.book.count({ where }),
    ]);

    const totalPages = Math.ceil(total / safeLimit) || 1;

    return NextResponse.json({
      data: books,
      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        totalPages,
        hasNext: safePage < totalPages,
        hasPrev: safePage > 1,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Error al buscar libros' },
      { status: 500 }
    );
  }
}
