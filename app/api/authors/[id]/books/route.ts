import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const author = await prisma.author.findUnique({
      where: { id },
    });

    if (!author) {
      return NextResponse.json(
        { error: 'Autor no encontrado' },
        { status: 404 }
      );
    }

    const books = await prisma.book.findMany({
      where: { authorId: id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ author, books });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Error al obtener libros del autor' },
      { status: 500 }
    );
  }
}
