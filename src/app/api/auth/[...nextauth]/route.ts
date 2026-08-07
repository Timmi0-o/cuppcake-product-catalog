import { handlers as authHandlers } from '@/configs/auth/auth';
import type { NextRequest } from 'next/server';

export const GET = (req: NextRequest) => authHandlers.GET(req);

export const POST = (req: NextRequest) => authHandlers.POST(req);
