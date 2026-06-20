import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  ThumbsUp,
  ThumbsDown,
  LogOut,
  PenLine,
  ArrowRight,
  Trash2,
  Image as ImageIcon,
  MessageSquare,
  User as UserIcon,
  Tag,
} from "lucide-react";
import {
  fetchPosts,
  createPost,
  deletePost,
  likePost,
  dislikePost,
} from "../features/posts/postSlice";
import { logout } from "../features/auth/authSlice";
import ThemeToggle from "../components/ThemeToggle";
import CommentSection from "../components/CommentSection";

const CATEGORIES = [
  "General",
  "Technology",
  "History",
  "Science",
  "Travel",
  "Food",
  "Lifestyle",
  "Sports",
  "Entertainment",
  "Education",
];

const CATEGORY_COLORS = {
  General: {
    bg: "bg-zinc-100 dark:bg-zinc-800",
    text: "text-zinc-600 dark:text-zinc-400",
  },
  Technology: {
    bg: "bg-blue-50 dark:bg-blue-950/40",
    text: "text-blue-600 dark:text-blue-400",
  },
  History: {
    bg: "bg-amber-50 dark:bg-amber-950/40",
    text: "text-amber-600 dark:text-amber-400",
  },
  Science: {
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    text: "text-emerald-600 dark:text-emerald-400",
  },
  Travel: {
    bg: "bg-sky-50 dark:bg-sky-950/40",
    text: "text-sky-600 dark:text-sky-400",
  },
  Food: {
    bg: "bg-orange-50 dark:bg-orange-950/40",
    text: "text-orange-600 dark:text-orange-400",
  },
  Lifestyle: {
    bg: "bg-pink-50 dark:bg-pink-950/40",
    text: "text-pink-600 dark:text-pink-400",
  },
  Sports: {
    bg: "bg-lime-50 dark:bg-lime-950/40",
    text: "text-lime-700 dark:text-lime-400",
  },
  Entertainment: {
    bg: "bg-purple-50 dark:bg-purple-950/40",
    text: "text-purple-600 dark:text-purple-400",
  },
  Education: {
    bg: "bg-teal-50 dark:bg-teal-950/40",
    text: "text-teal-600 dark:text-teal-400",
  },
};

const Home = () => {
  const dispatch = useDispatch();
  const { posts, loading } = useSelector((state) => state.posts);
  const { user, token } = useSelector((state) => state.auth);

  const [postData, setPostData] = useState({
    title: "",
    content: "",
    category: "General",
  });
  const [image, setImage] = useState(null);
  const [activeComments, setActiveComments] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const fileInputRef = useRef(null);
  const filterBarRef = useRef(null);

  useEffect(() => {
    dispatch(fetchPosts(activeCategory));
  }, [dispatch, activeCategory]);

  const handleChange = (e) => {
    setPostData({ ...postData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!token) {
      alert("Please Login First");
      return;
    }
    const formData = new FormData();
    formData.append("title", postData.title);
    formData.append("content", postData.content);
    formData.append("category", postData.category);
    if (image) {
      formData.append("image", image);
    }
    dispatch(createPost(formData));
    setPostData({ title: "", content: "", category: "General" });
    setImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleLike = (id) => {
    if (!token) return alert("Please Login First");
    dispatch(likePost(id));
  };

  const handleDislike = (id) => {
    if (!token) return alert("Please Login First");
    dispatch(dislikePost(id));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      dispatch(deletePost(id));
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleCategoryFilter = (cat) => {
    setActiveCategory(cat);
    setActiveComments(null);
  };

  const getCategoryStyle = (cat) => {
    return CATEGORY_COLORS[cat] || CATEGORY_COLORS["General"];
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-300 flex flex-col md:flex-row font-sans selection:bg-zinc-900 selection:text-zinc-100 dark:selection:bg-zinc-100 dark:selection:text-zinc-900 transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-full md:w-80 border-b md:border-b-0 md:border-r border-zinc-200 dark:border-zinc-800 p-8 flex flex-col justify-between md:sticky md:top-0 md:h-screen bg-zinc-50 dark:bg-[#09090b] z-20 transition-colors duration-300">
        <div>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tighter">
              GUESS.com
            </h1>
            <ThemeToggle />
          </div>
          <p className="text-sm text-zinc-500 mb-12">Write. Read. Repeat.</p>

          <div className="space-y-6">
            <h2 className="text-xs uppercase tracking-widest text-zinc-400 dark:text-zinc-600 font-semibold">
              Menu
            </h2>
            <div className="flex flex-col gap-4">
              {token ? (
                <>
                  <div className="p-4 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm">
                    Logged in as{" "}
                    <span className="text-zinc-900 dark:text-zinc-100 font-medium">
                      {user?.name}
                    </span>
                  </div>
                  <Link
                    to="/profile"
                    className="flex items-center justify-between px-4 py-3 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-900 border border-transparent hover:border-zinc-300 dark:hover:border-zinc-800 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt="Avatar"
                          className="w-5 h-5 rounded-full object-cover"
                        />
                      ) : (
                        <UserIcon className="w-5 h-5" />
                      )}
                      Profile
                    </div>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-between px-4 py-3 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-900 border border-transparent hover:border-zinc-300 dark:hover:border-zinc-800 transition-colors"
                  >
                    Sign Out <LogOut className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="flex justify-between items-center px-4 py-3 text-sm font-medium border border-zinc-300 dark:border-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-900 transition-colors"
                  >
                    Sign In <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/register"
                    className="flex justify-between items-center px-4 py-3 text-sm font-medium bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-white transition-colors"
                  >
                    Create Account <PenLine className="w-4 h-4" />
                  </Link>
                </>
              )}
            </div>

          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 md:p-16 lg:px-24 max-w-4xl relative">
        {/* Post Creation Form */}
        <section className="mb-20">
          <h2 className="text-xl font-medium text-zinc-900 dark:text-zinc-100 mb-6">
            Draft a new post
          </h2>
          <form
            onSubmit={handleSubmit}
            className="space-y-0 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-transparent"
          >
            <input
              type="text"
              name="title"
              placeholder="Post Title..."
              value={postData.title}
              onChange={handleChange}
              className="w-full p-4 bg-transparent border-b border-zinc-200 dark:border-zinc-800 text-xl text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 outline-none focus:bg-zinc-50 dark:focus:bg-zinc-900/50 transition-colors"
            />
            <textarea
              name="content"
              placeholder="What are your thoughts?"
              value={postData.content}
              onChange={handleChange}
              className="w-full h-40 p-4 bg-transparent border-b border-zinc-200 dark:border-zinc-800 text-base text-zinc-700 dark:text-zinc-300 placeholder-zinc-400 dark:placeholder-zinc-600 outline-none resize-none focus:bg-zinc-50 dark:focus:bg-zinc-900/50 transition-colors"
            />

            {/* Category Selector */}
            <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/20 flex items-center gap-3">
              <Tag className="w-4 h-4 text-zinc-400 flex-shrink-0" />
              <label
                htmlFor="post-category"
                className="text-sm text-zinc-500 font-medium whitespace-nowrap"
              >
                Category
              </label>
              <select
                id="post-category"
                name="category"
                value={postData.category}
                onChange={handleChange}
                className="flex-1 bg-transparent text-sm text-zinc-700 dark:text-zinc-300 outline-none cursor-pointer border border-zinc-200 dark:border-zinc-700 px-3 py-1.5 focus:border-zinc-400 dark:focus:border-zinc-500 transition-colors rounded"
              >
                {CATEGORIES.map((cat) => (
                  <option
                    key={cat}
                    value={cat}
                    className="bg-white dark:bg-zinc-900"
                  >
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center p-4 bg-zinc-50 dark:bg-transparent">
              <label className="flex items-center gap-2 cursor-pointer text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors mb-4 sm:mb-0">
                <ImageIcon className="w-5 h-5" />
                <span className="text-sm">Upload Image</span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                  ref={fileInputRef}
                />
              </label>
              {image && (
                <span className="text-xs text-zinc-500 mx-4 truncate max-w-[200px]">
                  {image.name}
                </span>
              )}
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 font-medium text-sm hover:bg-zinc-800 dark:hover:bg-white transition-colors"
              >
                Publish Post
              </button>
            </div>
          </form>
        </section>

        {/* Blog Feed Section */}
        <section className="space-y-12">
          {/* Header + Category Filter Bar */}
          <div className="border-b border-zinc-200 dark:border-zinc-800 pb-0">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 gap-4">
              <h2 className="text-xl font-medium text-zinc-900 dark:text-zinc-100">
                {activeCategory === "All"
                  ? "Recent Publications"
                  : `${activeCategory} Posts`}
              </h2>
              {activeCategory !== "All" && (
                <button
                  onClick={() => handleCategoryFilter("All")}
                  className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors underline underline-offset-2"
                >
                  Clear filter
                </button>
              )}
            </div>

            {/* Scrollable Filter Tabs */}
            <div
              ref={filterBarRef}
              className="flex gap-1 overflow-x-auto pb-0 scrollbar-none -mb-px"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {["All", ...CATEGORIES].map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => handleCategoryFilter(cat)}
                    className={`flex-shrink-0 px-4 py-2.5 text-sm font-medium border-b-2 transition-all duration-150 ${isActive
                      ? "border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100"
                      : "border-transparent text-zinc-400 dark:text-zinc-600 hover:text-zinc-700 dark:hover:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700"
                      }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Posts Feed */}
          {loading ? (
            <div className="flex flex-col gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse space-y-3">
                  <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-2/3" />
                  <div className="h-4 bg-zinc-100 dark:bg-zinc-900 rounded w-1/3" />
                  <div className="h-20 bg-zinc-100 dark:bg-zinc-900 rounded" />
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <p className="text-zinc-500 dark:text-zinc-600 font-serif italic text-lg">
              {activeCategory === "All"
                ? "No entries found. Be the first to write."
                : `No posts in "${activeCategory}" yet. Be the first!`}
            </p>
          ) : (
            posts.map((post) => {
              const isLiked =
                user && post.likes?.some((id) => id.toString() === user._id);
              const catStyle = getCategoryStyle(post.category || "General");
              return (
                <article key={post._id} className="group">
                  <header className="mb-4 flex justify-between items-start">
                    <div>
                      {/* Category Badge */}
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium rounded-full mb-2 ${catStyle.bg} ${catStyle.text}`}
                      >
                        <Tag className="w-3 h-3" />
                        {post.category || "General"}
                      </span>
                      <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2 leading-tight">
                        {post.title}
                      </h3>
                      <p className="text-sm text-zinc-500 mt-1">
                        Written by{" "}
                        <span className="text-zinc-700 dark:text-zinc-300">
                          {post.user?.name || "Unknown"}
                        </span>
                        <span className="mx-2">•</span>
                        {new Date(post.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}{" "}
                        at{" "}
                        {new Date(post.createdAt).toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    {user && post.user?._id === user._id && (
                      <button
                        onClick={() => handleDelete(post._id)}
                        className="text-red-500 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </header>

                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-wrap mb-6">
                    {post.content}
                  </p>

                  {post.image && (
                    <img
                      src={post.image}
                      alt="Post content"
                      className="w-full max-h-[500px] object-cover border border-zinc-200 dark:border-zinc-800 mb-6"
                    />
                  )}

                  <footer className="flex items-center gap-6">
                    <button
                      onClick={() => handleLike(post._id)}
                      className={`flex items-center gap-2 text-sm font-medium transition-colors ${isLiked
                        ? "text-zinc-900 dark:text-zinc-100"
                        : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300"
                        }`}
                    >
                      <ThumbsUp
                        className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`}
                      />
                      {post.likes?.length || 0}
                    </button>
                    <button
                      onClick={() => handleDislike(post._id)}
                      className="flex items-center gap-2 text-sm font-medium text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                    >
                      <ThumbsDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() =>
                        setActiveComments(
                          activeComments === post._id ? null : post._id,
                        )
                      }
                      className="flex items-center gap-2 text-sm font-medium text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                    >
                      <MessageSquare className="w-4 h-4" /> Comments
                    </button>

                    {/* Inline category filter button on post */}
                    <button
                      onClick={() =>
                        handleCategoryFilter(post.category || "General")
                      }
                      className={`ml-auto flex items-center gap-1 text-xs font-medium transition-colors ${catStyle.text} hover:opacity-80`}
                    >
                      <Tag className="w-3 h-3" />
                      More {post.category || "General"}
                    </button>
                  </footer>

                  {activeComments === post._id && (
                    <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-800">
                      <CommentSection postId={post._id} />
                    </div>
                  )}

                  <div className="mt-8 border-b border-zinc-100 dark:border-zinc-900" />
                </article>
              );
            })
          )}
        </section>
      </main>
    </div>
  );
};

export default Home;
