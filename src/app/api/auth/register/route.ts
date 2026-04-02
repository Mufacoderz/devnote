import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"

export async function POST(req: NextRequest) {

    // ambil data dari request body
    const { name, email, password } = await req.json()

    // validasi — return error 400 kalau ada field yang kosong
    if (!name || !email || !password) {
        return NextResponse.json(
            { message: "Semua field harus diisi" },
            { status: 400 }
        )
    }
    

    // cek apakah email sudah terdaftar
    const existingUser = await prisma.user.findUnique({
        where: { email },

    })

    // kalau email sudah ada, return error 400 dengan pesan "Email sudah terdaftar"
    if (existingUser) {
        return NextResponse.json(
            { message: "Email sudah terdaftar" },
            { status: 400 }
        )
    }

    // hash password sebelum disimpan
    const hashedPassword = await bcrypt.hash(password, 10)

    // simpan user baru ke database
    // hint: prisma.user.create, field yang dibutuhkan: name, email, password
    const user = await prisma.user.create({
        data: {
            // name: name,
            // email: email, singkat jdi
            name,
            email,
            password : hashedPassword
        }
    })

    // return response sukses 201 dengan data user (tanpa password)
    return NextResponse.json(
        {
            message: "Registrasi berhasil",
            user: {
                id: user.id,
                name: name,
                email: email,
            }
        },
        { status: 201 }
    )
}