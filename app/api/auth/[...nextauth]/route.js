import connectDB from "@/util/database";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import KakaoProvider from "next-auth/providers/kakao";
import NaverProvider from "next-auth/providers/naver";

export const authOptions = {
  providers: [
    KakaoProvider({
      id: "kakao",
      name: "Kakao",
      clientId: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET || "",
      authorization: {
        url: "https://kauth.kakao.com/oauth/authorize",
        params: { scope: "profile_nickname profile_image account_email",
          prompt: "login",
         },
      },
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.kakao_account?.profile?.nickname || "No Name",
          email: profile.kakao_account?.email || null,
          image: profile.kakao_account?.profile?.profile_image || null,
        };
      },
    }),
    NaverProvider({
      id: "naver",
      name: "Naver",
      clientId: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET || "",
      authorization: {
        url: "https://nid.naver.com/oauth2.0/authorize",
        params: {
          response_type: "code",
          scope: "name email profile_image",
          auth_type: "reauthenticate",
        },
      },
      profile(profile) {
        const res = profile.response;
        return {
          id: res.id.toString(),
          name: res.name || "No Name",
          email: res.email || `naver_${res.id}@naver.com`,
          image: res.profile_image || null,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          // 구글은 prompt=login이 아니라 select_account/consent 사용
          prompt: "select_account",
          // 필요시 offline/consent도 추가 가능
          // access_type: "offline",
          // include_granted_scopes: true,
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account }) {
      // user: { name, email, image, id }
      const userEmail =
        user.email || `${account.provider}_${user.id}@example.com`;
      try {
        const db = (await connectDB).db("chugo");
        const emailToUse = user.email || userEmail;
        const existingUser = await db
          .collection("user")
          .findOne({ email: emailToUse });

        if (!existingUser) {
          // 회원정보 새로 생성
          await db.collection("user").insertOne({
            id: user.id,
            name: user.name,
            email: emailToUse,
            image: user.image || null,
            provider: account.provider,
            phone: user.phone || null,
            yymmdd: user.year || null,
            zipcode: null,
            isAdmin: "false",
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        } else {
          // 기존 회원 업데이트 (예: 프로필 이미지 변경)
          await db.collection("user").updateOne(
            { email: emailToUse },
            {
              $set: {
                name: user.name,
                image: user.image,
                updatedAt: new Date(),
              },
            }
          );
        }
        return true; // 로그인 계속 진행
      } catch (error) {
        console.error("signIn 콜백 DB 에러:", error);
        return false; // 로그인 실패 처리
      }
    },

    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
