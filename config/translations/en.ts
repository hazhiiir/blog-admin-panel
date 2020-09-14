export const en = {
  layout: {
    header: {
      title: "Arvan Challenge",
      greeting: "Welcome {username}"
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
  }
};

export default en;
