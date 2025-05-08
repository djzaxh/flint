// app/admin/AdminPanel.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Loader2,
  Upload,
  FileText,
  Trash2,
  Edit,
  Eye,
  Save,
  X,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  content: string;
  filename: string;
}

export default function AdminPanel() {
  // Upload state
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Post management state
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editExcerpt, setEditExcerpt] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editDate, setEditDate] = useState("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  // Fetch posts on component mount
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoadingPosts(true);
    try {
      const response = await fetch("/api/blog/posts");
      const data = await response.json();

      if (response.ok) {
        setPosts(data.posts);
      } else {
        toast.error("Failed to fetch blog posts");
      }
    } catch (error) {
      toast.error("An error occurred while fetching posts");
    } finally {
      setLoadingPosts(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (selectedFile) {
      if (!selectedFile.name.endsWith(".md")) {
        toast.error("Only markdown (.md) files are allowed");
        return;
      }
      setFile(selectedFile);
      setTitle(selectedFile.name.replace(".md", ""));

      // Read file content
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileContent = (event.target?.result as string) || "";

        // Check if the file has frontmatter
        if (fileContent.startsWith("---")) {
          const endOfFrontmatter = fileContent.indexOf("---", 3);
          if (endOfFrontmatter !== -1) {
            const frontmatter = fileContent.substring(3, endOfFrontmatter);
            const content = fileContent.substring(endOfFrontmatter + 3).trim();

            // Parse frontmatter
            const titleMatch = frontmatter.match(/title:\s*(.+)/);
            const excerptMatch = frontmatter.match(/excerpt:\s*(.+)/);

            if (titleMatch && titleMatch[1]) {
              setTitle(titleMatch[1].trim());
            }

            if (excerptMatch && excerptMatch[1]) {
              setExcerpt(excerptMatch[1].trim());
            }

            setContent(content);
          } else {
            setContent(fileContent);
          }
        } else {
          setContent(fileContent);
        }
      };
      reader.readAsText(selectedFile);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleExcerptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExcerpt(e.target.value);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const resetForm = () => {
    setFile(null);
    setTitle("");
    setExcerpt("");
    setContent("");
    setStatus("idle");
    setErrorMessage("");
    setSuccessMessage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const uploadFile = async () => {
    if (!title || !content) {
      toast.error("Title and content are required");
      return;
    }

    setStatus("loading");
    setErrorMessage("");
    setSuccessMessage("");

    try {
      // Format the current date as YYYY-MM-DD
      const now = new Date();
      const formattedDate = now.toISOString().split("T")[0];

      // Create frontmatter
      const frontmatter = `---
title: ${title}
excerpt: ${excerpt || "No excerpt provided"}
date: ${formattedDate}
---

`;

      // Combine frontmatter with content
      const fullContent = frontmatter + content;

      // Create a new file with the current title and content
      const newFile = new File(
        [fullContent],
        `${title.toLowerCase().replace(/\s+/g, "-")}.md`,
        { type: "text/markdown" }
      );

      const formData = new FormData();
      formData.append("file", newFile);

      const res = await fetch("/api/blog/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setSuccessMessage(`Successfully uploaded: ${data.slug}`);
        toast.success("Blog post uploaded successfully");
        resetForm();
        fetchPosts(); // Refresh the posts list
      } else {
        setStatus("error");
        setErrorMessage(data.error || "Failed to upload blog post");
        toast.error(data.error || "Failed to upload blog post");
      }
    } catch (error) {
      setStatus("error");
      setErrorMessage("An unexpected error occurred");
      toast.error("An unexpected error occurred");
    }
  };

  const handleEditPost = (post: BlogPost) => {
    setSelectedPost(post);
    setEditTitle(post.title);
    setEditExcerpt(post.excerpt);
    setEditContent(post.content);
    setEditDate(post.date);
    setEditMode(true);
    setPreviewMode(false);
  };

  const handleSaveEdit = async () => {
    if (!selectedPost || !editTitle || !editContent) {
      toast.error("Title and content are required");
      return;
    }

    try {
      // Create frontmatter
      const frontmatter = `---
title: ${editTitle}
excerpt: ${editExcerpt || "No excerpt provided"}
date: ${editDate}
---

`;

      // Combine frontmatter with content
      const fullContent = frontmatter + editContent;

      const res = await fetch("/api/blog/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filename: selectedPost.filename,
          content: fullContent,
        }),
      });

      if (res.ok) {
        toast.success("Blog post updated successfully");
        setEditMode(false);
        fetchPosts(); // Refresh the posts list
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to update blog post");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    }
  };

  const handleDeletePost = (post: BlogPost) => {
    setPostToDelete(post);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!postToDelete) return;

    try {
      const res = await fetch("/api/blog/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filename: postToDelete.filename,
        }),
      });

      if (res.ok) {
        toast.success("Blog post deleted successfully");
        setDeleteConfirmOpen(false);
        fetchPosts(); // Refresh the posts list
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to delete blog post");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    }
  };

  const togglePreview = () => {
    setPreviewMode(!previewMode);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Blog Post Manager</CardTitle>
          <CardDescription>Upload and manage your blog posts</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Upload Post</TabsTrigger>
              <TabsTrigger value="manage">Manage Posts</TabsTrigger>
            </TabsList>
            <TabsContent value="upload" className="space-y-4">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="file">Upload Markdown File</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="file"
                      type="file"
                      accept=".md"
                      onChange={handleFileChange}
                      ref={fileInputRef}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        if (fileInputRef.current) {
                          fileInputRef.current.click();
                        }
                      }}
                    >
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={handleTitleChange}
                    placeholder="Enter post title"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Input
                    id="excerpt"
                    value={excerpt}
                    onChange={handleExcerptChange}
                    placeholder="Enter a short excerpt for the blog post"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={handleContentChange}
                    placeholder="Enter post content in Markdown format"
                    className="min-h-[300px] font-mono"
                  />
                </div>

                {status === "error" && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{errorMessage}</AlertDescription>
                  </Alert>
                )}

                {status === "success" && (
                  <Alert>
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>{successMessage}</AlertDescription>
                  </Alert>
                )}
              </div>
            </TabsContent>
            <TabsContent value="manage" className="space-y-4">
              {loadingPosts ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No blog posts found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {posts.map((post) => (
                        <TableRow key={post.slug}>
                          <TableCell className="font-medium">
                            {post.title}
                          </TableCell>
                          <TableCell>{formatDate(post.date)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditPost(post)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeletePost(post)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={resetForm}
            disabled={status === "loading"}
          >
            Reset
          </Button>
          <Button
            onClick={uploadFile}
            disabled={status === "loading" || !title || !content}
          >
            {status === "loading" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Post
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* Edit Dialog */}
      {selectedPost && (
        <Dialog open={editMode} onOpenChange={setEditMode}>
          <DialogContent className="max-w-4xl overflow-hidden">
            <DialogHeader>
              <DialogTitle>Edit Blog Post</DialogTitle>
              <DialogDescription>
                Make changes to your blog post
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4 max-h-[calc(80vh-8rem)] overflow-y-auto">
              <div className="flex justify-between items-center sticky top-0 bg-background py-2">
                <div className="space-y-1">
                  <h3 className="text-lg font-medium">{editTitle}</h3>
                  <p className="text-sm text-muted-foreground">
                    Last updated: {formatDate(editDate)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={togglePreview}>
                    {previewMode ? (
                      <>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </>
                    ) : (
                      <>
                        <Eye className="mr-2 h-4 w-4" />
                        Preview
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {previewMode ? (
                <div className="prose dark:prose-invert max-w-none">
                  <h1>{editTitle}</h1>
                  <p className="text-muted-foreground">{editExcerpt}</p>
                  <div className="mt-4">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {editContent}
                    </ReactMarkdown>
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-title">Title</Label>
                    <Input
                      id="edit-title"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="edit-excerpt">Excerpt</Label>
                    <Input
                      id="edit-excerpt"
                      value={editExcerpt}
                      onChange={(e) => setEditExcerpt(e.target.value)}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="edit-content">Content</Label>
                    <Textarea
                      id="edit-content"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="min-h-[300px] font-mono resize-none"
                    />
                  </div>
                </>
              )}
            </div>
            <DialogFooter className="sticky bottom-0 bg-background py-2">
              <Button variant="outline" onClick={() => setEditMode(false)}>
                Cancel
              </Button>
              {!previewMode && (
                <Button onClick={handleSaveEdit}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Blog Post</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this blog post? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {postToDelete && (
              <div className="space-y-2">
                <h3 className="font-medium">{postToDelete.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {postToDelete.excerpt}
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
