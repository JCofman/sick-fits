const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { randomBytes } = require("crypto");
const { promisify } = require("util");
const { transport, makeANiceEmail } = require("../mail");
const { hasPermission } = require("../utils");

const mutations = {
  async createItem(parent, args, ctx, info) {
    //TODO check that they are logged in
    if (!ctx.request.userId) {
      throw new Error("You must be logged in to do that!");
    }
    const item = await ctx.db.mutation.createItem(
      {
        data: {
          // this is how to create a relationship betweeen the Item and the User
          user: {
            connect: {
              id: ctx.request.userId
            }
          },
          ...args
        }
      },
      info
    );
    return item;
  },

  async updateItem(parent, args, ctx, info) {
    // first take a copy
    const updates = { ...args };
    // delete id
    delete updates.id;

    const item = await ctx.db.mutation.updateItem(
      {
        data: updates,
        where: {
          id: args.id
        }
      },
      info
    );
    return item;
  },

  async deleteItem(parent, args, ctx, info) {
    const where = { id: args.id };
    // 1. find the item
    const item = await ctx.db.query.item({ where }, `{ id title user {id}}`);
    // 2. Check if they own that item, or have the permissions

    const ownsItem = item.user.id === ctx.request.userId;

    const hasPermission = ctx.request.user.permissions.some(permission =>
      ["ADMIN", "ITEMDELETE"].includes(permission)
    );

    if (!ownsItem && hasPermissions) {
      throw new Error("You dont have permissions to do");
    }
    // 3. Delete it!

    return ctx.db.mutation.deleteItem({ where }, info);
  },

  async signup(parent, args, ctx, info) {
    //always lowercase
    args.email = args.email.toLowerCase();
    //hash the password
    const password = await bcrypt.hash(args.password, 10);
    const user = await ctx.db.mutation.createUser({
      data: {
        ...args,
        password,
        permissions: { set: ["USER"] }
      },
      info
    });
    // create jwt token

    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    ctx.response.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365 // 1 year cookie
    });

    return user;
  },

  async signin(parent, { email, password }, ctx, info) {
    const user = await ctx.db.query.user({
      where: {
        email
      }
    });

    if (!user) {
      throw new Error(`No such user found for email ${email} `);
    }
    // create jwt token
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error(`Invalid email or password`);
    }
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    ctx.response.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365 // 1 year cookie
    });

    return user;
  },

  signout(parent, args, ctx, info) {
    ctx.response.clearCookie("token");
    return { message: "Goodbye!" };
  },

  async requestReset(parent, args, ctx, info) {
    // 1. Check if this is a real user
    const user = await ctx.db.query.user({
      where: {
        email: args.email
      }
    });
    if (!user) {
      throw new Error(`No such user found for email ${args.email} `);
    }
    // 2. set a reset token and expiry on that user
    const resetToken = (await promisify(randomBytes)(20)).toString("hex");
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now

    const res = await ctx.db.mutation.updateUser({
      where: { email: args.email },
      data: { resetToken, resetTokenExpiry }
    });
    // 3. email
    const mailRes = await transport.sendMail({
      from: "cofman.jacob@gmail.com",
      to: user.email,
      subject: "Your Password reset",
      html: makeANiceEmail(`Your Password Reset Token is here! 
      \n\n 
      <a href=${
        process.env.FRONTEND_URL
      }/reset?resetToken=${resetToken}> click here to reset </a>
      `)
    });

    return { message: "Thanks!" };
  },

  async resetPassword(parent, args, ctx, info) {
    // 1. check if the password matches
    const valid = args.password === args.confirmPassword;
    if (!valid) {
      throw new Error(`Password dont match`);
    }
    // 2. check if its a legit reset token
    // 3. check if its expired

    const [user] = await ctx.db.query.users({
      where: {
        resetToken: args.resetToken,
        resetTokenExpiry_gte: Date.now() - 360000
      }
    });

    if (!user) {
      throw new Error(`The token is not valid or expired`);
    }
    // 4. hash their new password
    // 5. save the new password to the user and remove old reset token field
    const password = await bcrypt.hash(args.password, 10);

    const updatedUser = await ctx.db.mutation.updateUser({
      where: { email: user.email },
      data: { password, resetToken: null, resetTokenExpiry: null }
    });
    console.log(updatedUser);
    // 6. generate JWT
    const token = jwt.sign({ userId: updatedUser.id }, process.env.APP_SECRET);
    // 7. set the jwt cookie
    ctx.response.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365
    });
    // 8. return new user
    return updatedUser;
    // 9. 🍺🍻👌🎶😎🍹😏🥃👍👊
  },

  async updatePermissions(parent, args, ctx, info) {
    // 1. Check if they are logged in
    if (!ctx.request.userId) {
      throw new Error("You must be logged in!");
    }
    // 2. Query the current user
    const currentUser = await ctx.db.query.user(
      {
        where: {
          id: ctx.request.userId
        }
      },
      info
    );
    // 3. Check if they have permissions to do this
    hasPermission(currentUser, ["ADMIN", "PERMISSIONUPDATE"]);
    // 4. Update the permissions
    return ctx.db.mutation.updateUser(
      {
        data: {
          permissions: {
            set: args.permissions
          }
        },
        where: {
          id: args.userId
        }
      },
      info
    );
  },
  async addToCart(parent, args, ctx, info) {
    // 1. Check if they are logged in
    const { userId } = ctx.request;
    if (!userId) {
      throw new Error("You must be logged in!");
    }
    // 2. Query the current cart
    const [existingCartItem] = await ctx.db.query.cartItems({
      where: {
        user: { id: userId },
        item: { id: args.id }
      }
    });
    // 3. Check if item is alread in their cart
    if (existingCartItem) {
      console.log("This item is already in their cart.");
      return ctx.db.mutation.updateCartItem({
        where: { id: existingCartItem.id },
        data: {
          quantity: existingCartItem.quantity + 1
        },
        info
      });
    }
    // 4. Update the permissions
    return ctx.db.mutation.createCartItem(
      {
        data: {
          user: {
            connect: { id: userId }
          },
          item: {
            connect: { id: args.id }
          }
        }
      },
      info
    );
  },

  async removeFromCart(parent, args, ctx, info) {
    // 1. Find the cart item
    const cartItem = await ctx.db.query.cartItem(
      {
        where: {
          id: args.id
        }
      },
      `{id, user {id}}`
    );

    if (!cartItem) throw new Error("No CartItem Found!!");
    // 2 make sure thy own that cart item
    if (cartItem.user.id !== ctx.request.userId) {
      throw new error("YOU ARE CHEATIING");
    }
    // 3. Delete that cart item
    return ctx.db.mutation.deleteCartItem(
      {
        where: { id: args.id }
      },
      info
    );
  }
};

module.exports = mutations;
