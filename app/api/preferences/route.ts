import {NextResponse} from 'next/server';
let prefs={briefing_time:'07:00',briefing_length:5,tone:'executive',sections:['schedule','inbox','followups','interests','plan'],interests:['AI agent regulation','enterprise SaaS funding'],privacy:{retainRawEmailDays:7}};
export async function GET(){return NextResponse.json(prefs)}
export async function POST(req:Request){prefs={...prefs,...await req.json()};return NextResponse.json(prefs)}
