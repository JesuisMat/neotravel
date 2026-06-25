import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

// GET /api/equipe — list all team members
export async function GET() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("team_members")
    .select("id, email, nom, role, actif, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ members: data });
}

// POST /api/equipe — create a new team member
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, nom, role, password } = body as {
    email: string;
    nom: string;
    role: "admin" | "commercial" | "direction";
    password: string;
  };

  if (!email || !nom || !role || !password) {
    return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
  }

  const supabase = createAdminClient();

  // Create Supabase Auth user
  const { data: authData, error: authError } =
    await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 400 });
  }

  const userId = authData.user.id;

  // Insert into team_members
  const { error: insertError } = await supabase.from("team_members").insert({
    user_id: userId,
    email,
    nom,
    role,
    actif: true,
  });

  if (insertError) {
    // Rollback: delete the auth user
    await supabase.auth.admin.deleteUser(userId);
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

// DELETE /api/equipe?id=<team_member_id> — deactivate (set actif=false) a member
export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "ID manquant" }, { status: 400 });
  }

  const supabase = createAdminClient();

  // Fetch to get user_id
  const { data: member, error: fetchError } = await supabase
    .from("team_members")
    .select("user_id, actif")
    .eq("id", id)
    .single();

  if (fetchError || !member) {
    return NextResponse.json({ error: "Membre introuvable" }, { status: 404 });
  }

  // Deactivate (soft delete — keep the row)
  const { error: updateError } = await supabase
    .from("team_members")
    .update({ actif: false })
    .eq("id", id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  // Disable login by removing the Supabase Auth user
  if (member.user_id) {
    await supabase.auth.admin.deleteUser(member.user_id);
  }

  return NextResponse.json({ success: true });
}
