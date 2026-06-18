import {NextRequest, NextResponse} from 'next/server';import {generateDemoBriefing} from '@/lib/briefing';
export async function GET(){return NextResponse.json({briefings:[await generateDemoBriefing()]})}
export async function POST(_req:NextRequest){return NextResponse.json(await generateDemoBriefing(),{status:201})}
