import {NextResponse} from 'next/server';import {generateDemoBriefing} from '@/lib/briefing';
export async function GET(){return NextResponse.json(await generateDemoBriefing())}
