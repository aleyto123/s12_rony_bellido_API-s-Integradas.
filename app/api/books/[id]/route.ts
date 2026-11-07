import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const book = await prisma.book.findUnique({
      where: { id },
      include: {
        author: true,
      },
    });

    if (!book) {
      return NextResponse.json(
        { error: 'Libro no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(book);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Error al obtener libro' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await request.json();
    const { title, description, isbn, publishedYear, genre, pages, authorId } = body;

    const book = await prisma.book.update({
      where: { id },
      data: {
        title,
        description,
        isbn,
        publishedYear: publishedYear !== undefined ? Number(publishedYear) : undefined,
        genre,
        pages: pages !== undefined ? Number(pages) : undefined,
        authorId,
      },
      include: {
        author: true,
      },
    });

    return NextResponse.json(book);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Libro no encontrado' },
        { status: 404 }
      );
    }

    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'El ISBN ya existe' },
        { status: 409 }
      );
    }

    console.error(error);
    return NextResponse.json(
      { error: 'Error al actualizar libro' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    await prisma.book.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Libro eliminado correctamente' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Libro no encontrado' },
        { status: 404 }
      );
    }

    console.error(error);
    return NextResponse.json(
      { error: 'Error al eliminar libro' },
      { status: 500 }
    );
  }
}
