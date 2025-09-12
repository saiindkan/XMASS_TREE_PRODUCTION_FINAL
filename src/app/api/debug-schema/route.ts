import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Check the qr_payments table schema
    const { data: schema, error } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, column_default, is_nullable')
      .eq('table_name', 'qr_payments')
      .eq('table_schema', 'public')

    if (error) {
      console.error('Error fetching schema:', error)
      return NextResponse.json({ error: 'Failed to fetch schema' }, { status: 500 })
    }

    return NextResponse.json({
      qr_payments_schema: schema
    })

  } catch (error) {
    console.error('Debug schema error:', error)
    return NextResponse.json(
      { error: 'Failed to debug schema' },
      { status: 500 }
    )
  }
}
