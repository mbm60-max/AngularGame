export const environment = {
    production:false,
    supabase:{
        url: process.env['SUPABASE_URL'],
        key: process.env['SUPABASE_KEY']
    }
};
