import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { getApks, getApkById, createApk, updateApk, deleteApk, getCategories, createCategory, incrementDownloadCount } from "./db";
import { storagePut, storageGet } from "./storage";
import { TRPCError } from "@trpc/server";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  apk: router({
    list: publicProcedure.query(async () => {
      return await getApks();
    }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const apk = await getApkById(input.id);
        if (!apk) throw new TRPCError({ code: "NOT_FOUND" });
        return apk;
      }),
    
    create: protectedProcedure
      .input(z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        version: z.string().min(1),
        categoryId: z.number().optional(),
        fileKey: z.string(),
        fileUrl: z.string(),
        fileSize: z.number().optional(),
        photoKey: z.string().optional(),
        photoUrl: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        return await createApk({
          ...input,
          createdBy: ctx.user.id,
        });
      }),
    
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        version: z.string().optional(),
        categoryId: z.number().optional(),
        photoKey: z.string().optional(),
        photoUrl: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        const { id, ...data } = input;
        return await updateApk(id, data);
      }),
    
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        return await deleteApk(input.id);
      }),
    
    download: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const apk = await getApkById(input.id);
        if (!apk) throw new TRPCError({ code: "NOT_FOUND" });
        await incrementDownloadCount(input.id);
        const downloadUrl = await storageGet(apk.fileKey);
        return downloadUrl;
      }),
  }),
  
  category: router({
    list: publicProcedure.query(async () => {
      return await getCategories();
    }),
    
    create: protectedProcedure
      .input(z.object({
        name: z.string().min(1),
        description: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        return await createCategory(input);
      }),
  }),
});

export type AppRouter = typeof appRouter;
