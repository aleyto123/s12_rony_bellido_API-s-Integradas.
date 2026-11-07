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
      include: {
        books: true,
      },
    });

    if (!author) {
      return NextResponse.json(
        { error: 'Autor no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(author);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Error al obtener autor' },
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
    const { name, email, bio, nationality, birthYear } = body;

    const existingAuthor = await prisma.author.findUnique({
      where: { id },
    });

    if (!existingAuthor) {
      return NextResponse.json(
        { error: 'Autor no encontrado' },
        { status: 404 }
      );
    }

    const author = await prisma.author.update({
      where: { id },
      data: {
        name,
        email,
        nationality,
        bio,
        birthYear: birthYear !== undefined ? Number(birthYear) : undefined,
      },
      include: {
        books: true,
      },
    });

    return NextResponse.json(author);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'El email ya está registrado' },
        { status: 409 }
      );
    }

    console.error(error);
    return NextResponse.json(
      { error: 'Error al actualizar autor' },
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
    await prisma.author.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Autor eliminado correctamente' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Autor no encontrado' },
        { status: 404 }
      );
    }

    console.error(error);
    return NextResponse.json(
      { error: 'Error al eliminar autor' },
      { status: 500 }
    );
  }
}
