// Drafts are only visible to their author
const canViewBlog = (blog, user) =>
  blog.status === 'published' || (!!user && user.id === blog.user_id);

module.exports = { canViewBlog };
