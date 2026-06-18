import {NextResponse} from 'next/server';
export async function POST(){return NextResponse.json({user:{id:'demo-user',email:'alex@example.com',name:'Alex Morgan'}})}
