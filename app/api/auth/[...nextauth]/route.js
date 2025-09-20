import connectDB from "@/util/database";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
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
        params: {
          scope: "profile_nickname profile_image account_email",
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
    CredentialsProvider({
      name: "credentials",
      async authorize(credentials) {
        // 이 부분에서 직접 만든 JWT 로그인 API를 호출하거나,
        // 기존 JWT 로그인 API의 인증 로직을 그대로 가져와서 사용
        const { identifier, password } = credentials;
        const db = (await connectDB).db("chugo");
        const user = await db.collection("user").findOne({
          $or: [{ email: identifier }, { id: identifier }],
        });

          if (!user) {
          return null; // 사용자를 찾을 수 없음
        }

        if (user && (await bcrypt.compare(password, user.password))) {
          // 인증 성공 시 사용자 정보 반환
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
          };
        }
        return null; // 인증 실패 시 null 반환
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account }) {
      // 소셜 로그인인 경우에만 실행되도록 수정
      if (account.provider !== 'credentials') {
        const userEmail = user.email || `${account.provider}_${user.id}@example.com`;
        try {
          const db = (await connectDB).db("chugo");
          const existingUser = await db.collection("user").findOne({ email: userEmail });
          
          if (!existingUser) {
            await db.collection("user").insertOne({
              id: user.id,
              name: user.name,
              email: userEmail,
              image: user.image || null,
              provider: account.provider,
              createdAt: new Date(),
              updatedAt: new Date(),
            });
          } else {
            await db.collection("user").updateOne(
              { email: userEmail },
              { $set: { name: user.name, image: user.image, updatedAt: new Date() } }
            );
          }
          return true;
        } catch (error) {
          console.error("signIn 콜백 DB 에러:", error);
          return false;
        }
      }
      return true; // CredentialsProvider는 여기서 그냥 true 반환
    },

    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
