import { createClient } from '@supabase/supabase-js';
import { format } from 'date-fns';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface AttendanceRecord {
  RowId: number;
  date: Date;
  Adult: number;
  Okids: number;
  Oyth: number;
  Total: number;
}

export async function fetchAttendanceData(startDate: Date, endDate: Date) {
  try {
    // Format dates for the query
    const formattedStartDate = format(startDate, 'yyyy-MM-dd');
    const formattedEndDate = format(endDate, 'yyyy-MM-dd');

    // First, let's check if we can list all tables
    const { data: tables, error: tablesError } = await supabase
      .from('sunday_service_attendance')
      .select('count');

    console.log('Tables check:', { tables, tablesError });

    // Now try the actual query with date filtering
    const { data, error } = await supabase
      .from('sunday_service_attendance')
      .select('RowId, date, Adult, Okids, Oyth, Total')
      .gte('date', formattedStartDate)
      .lte('date', formattedEndDate)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error details:', error);
      throw error;
    }

    console.log('Raw data from Supabase:', data);

    if (!data || data.length === 0) {
      console.log('No data returned from Supabase');
      return [];
    }

    // Transform the data to ensure dates are properly handled
    return data.map(record => ({
      ...record,
      date: new Date(record.date)
    })) as AttendanceRecord[];
  } catch (error) {
    console.error('Error in fetchAttendanceData:', error);
    throw error;
  }
}