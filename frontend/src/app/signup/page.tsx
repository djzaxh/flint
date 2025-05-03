"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AvatarUpload } from "@/components/ui/avatar-upload";
import { toast } from "sonner";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    setLoading(true);
    try {
      // 1. Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (authError) throw authError;

      // 2. If there's an avatar, upload it
      if (avatar && authData.user) {
        const fileExt = avatar.name.split(".").pop();
        const fileName = `${authData.user.id}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(fileName, avatar);

        if (uploadError) {
          console.error("Error uploading avatar:", uploadError);
          toast.error(
            "Failed to upload profile picture, but account was created"
          );
        } else {
          // Get the public URL
          const {
            data: { publicUrl },
          } = supabase.storage.from("avatars").getPublicUrl(fileName);

          // Update user metadata with avatar URL
          await supabase.auth.updateUser({
            data: { avatar_url: publicUrl },
          });
        }
      }

      toast.success("Account created! Redirecting…");
      router.push("/dashboard");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <a href="/">
            <img
              src="/logo.png"
              alt="Flint logo"
              className="h-10 w-auto hover:opacity-90 transition"
            />
          </a>
        </div>

        {/* Signup Card */}
        <Card>
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>Create your Flint account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
            <Button
              onClick={handleSignup}
              disabled={loading || !email || !password || !name}
              className="w-full"
            >
              {loading ? "Creating account…" : "Sign Up"}
            </Button>

            <p className="text-sm text-center text-muted-foreground mt-2">
              Already have an account?{" "}
              <a
                href="/login"
                className="hover:underline hover:text-blue-500 transition"
              >
                Log in
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
