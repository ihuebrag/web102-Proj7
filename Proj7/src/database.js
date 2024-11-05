// Import Supabase
import { createClient } from '@supabase/supabase-js';

// Initialize with your Supabase URL and anonymous key
const supabaseUrl = 'https://xgxddfiuyjvhnrjxxeqm.supabase.co'; // Replace with your Supabase URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhneGRkZml1eWp2aG5yanh4ZXFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA3ODUyOTAsImV4cCI6MjA0NjM2MTI5MH0.NzXQ0O5W1VAGDFvGSAYd4ntxbv7gMzPUKszDVJRFeIk'; // Replace with your Supabase anon key
const supabase = createClient(supabaseUrl, supabaseKey);

export function getCharacterList() {
    return supabase.from("characters").select("*");
}
export async function getCharacterById(id) {
    const { data, error } = await supabase
        .from("population") // Ensure this matches your table name
        .select("*")
        .eq("id", id)
        .single(); // Fetch a single character by ID

    if (error) {
        console.error("Error fetching character by ID:", error);
        return { error };
    }

    return { data };
}

export function getPopulationList() {
    return supabase.from("population").select("*");
}

export default supabase;
