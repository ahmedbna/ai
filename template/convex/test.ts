import { v } from 'convex/values';
import { query } from './_generated/server';
import { mutation } from './_generated/server';
import { getAuthUserId } from '@convex-dev/auth/server';

export const get = query({
  args: {},
  handler: async (ctx) => {
    const media = await ctx.db.query('media').collect();

    return Promise.all(
      media.map(async (file) => ({
        const url = await ctx.storage.getUrl(file.storageId);
        
        return {
          ...file,
          url,
        }
      }))
    );
  },
});

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const sendMedia = mutation({
  args: {
    storageId: v.id('_storage'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error('Not authenticated');
    }

    await ctx.db.insert('media', { userId, storageId: args.storageId });
  },
});
