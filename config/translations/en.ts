export const en = {
  layout: {
    header: {
      title: "Arvan Challenge",
      greeting: "Welcome {username}",
      action: "Logout"
    },
    sidebar: {
      title: "Post",
      main: "All Articles",
      secondary: "New Article"
    }
  },
  auth: {
    fieldValidation: {
      required: "Required Field",
      email: "Invalid Format"
    },
    register: {
      title: "Register",
      button: "Register",
      loadingButton: "Loading...",
      fields: {
        username: {
          label: "User",
          placeholder: "sara"
        },
        password: {
          label: "Password"
        },
        email: {
          label: "Email",
          placeholder: "sara@catmail.com"
        }
      },
      secondaryAction: {
        title: "Login",
        desctiption: "Already Registered?",
        href: "/"
      }
    },
    login: {
      title: "Login",
      button: "Login",
      loadingButton: "Loading...",
      fields: {
        password: {
          label: "Password"
        },
        email: {
          label: "Email",
          placeholder: "sara@catmail.com"
        }
      },
      secondaryAction: {
        title: "Register Now",
        desctiption: "Don’t have account?",
        href: "/register"
      }
    }
  },
  articles: {
    read: {
      title: "All Posts",
      emptyText: "Nothing found!",
      actions: {
        delete: "Delete",
        update: "Edit"
      },
      deleteModal: {
        title: "Delete Article",
        caption: "Are you sure to delete Article?",
        buttons: {
          yes: "Yes",
          no: "No"
        }
      },
      heading: {
        number: "#",
        title: "Title",
        author: "Author",
        tags: "Tags",
        excerpt: "Excerpt",
        created: "Created"
      }
    },
    delete: {
      successMessage: "Article deleted successfuly!"
    },
    create: {
      title: "New Article",
      submitButton: "Submit",
      loadingButton: "Loading...",
      successMessage: "<strong>Well done!</strong> Article created successfuly",
      fields: {
        title: {
          label: "Title",
          placeholder: "Title"
        },
        description: {
          label: "Description",
          placeholder: "Description"
        },
        body: {
          label: "Body",
          placeholder: "Write something..."
        },
        tagList: {
          label: "Tag",
          placeholder: "New Tag"
        }
      }
    },
    update: {
      title: "New Article",
      submitButton: "Submit",
      loadingButton: "Loading...",
      successMessage: "<strong>Well done!</strong> Article updated successfuly",
      fields: {
        title: {
          label: "Title",
          placeholder: "Title"
        },
        description: {
          label: "Description",
          placeholder: "Description"
        },
        body: {
          label: "Body",
          placeholder: "Write something..."
        },
        tagList: {
          label: "Tag",
          placeholder: "New Tag"
        }
      }
    },
    fieldValidation: {
      required: "Required Field"
    }
  }
};

export default en;
