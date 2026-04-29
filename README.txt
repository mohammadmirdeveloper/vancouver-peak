Vancouver Peak V6 Supabase

Steps:
1. Create Supabase project.
2. Run supabase_setup.sql in Supabase SQL Editor.
3. In Supabase Storage create a public bucket named: tour-images
4. Upload this full project to GitHub replacing old files.
5. In Vercel settings add:
   SUPABASE_URL
   SUPABASE_SERVICE_ROLE_KEY
   ADMIN_PASSWORD
6. Redeploy.

This version stores bookings, prices and images in Supabase.
