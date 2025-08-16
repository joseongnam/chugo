"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { useState } from "react";

export default function Join() {
  const router = useRouter();
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i); // 최근 100년
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const getDays = () => {
    if (!year || !month) return [];
    const daysInMonth = new Date(year, month, 0).getDate(); // 해당 달의 마지막 날짜
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  };

  const [id, setId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");
  const [name, setName] = useState("");
  const [phonePart1, setPhonePart1] = useState("010");
  const [phonePart2, setPhonePart2] = useState("");
  const [phonePart3, setPhonePart3] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [showMessage, setShowMessage] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [detailAddress, setDetailAddress] = useState("");

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const openDaumPostcode = () => {
    if (typeof window !== "undefined" && window.daum && window.daum.Postcode) {
      new window.daum.Postcode({
        oncomplete: function (data) {
          let addr = data.address;
          let extra = "";

          if (data.addressType === "R") {
            if (data.bname) extra += data.bname;
            if (data.buildingName)
              extra += extra ? `, ${data.buildingName}` : data.buildingName;
            if (extra) addr += ` (${extra})`;
          }

          setFullAddress(addr);
          setZipcode(data.zonecode);
        },
      }).open();
    } else {
      console.log("다음 우편번호 스크립트 로드 대기 중...");
    }
  };
  const handleSocialLogin = (provider) => {
    signIn(provider, { callbackUrl: "/" });
  };

  const validatePassword = (pw) => {
    const lengthValid = pw.length >= 10 && pw.length <= 16;
    const hasLetter = /[a-zA-Z]/.test(pw);
    const hasNumber = /\d/.test(pw);
    const hasSpecial = /[!@#$%^&*()_+]/.test(pw);

    const count = [hasLetter, hasNumber, hasSpecial].filter(Boolean).length;

    return lengthValid && count >= 2;
  };

  // 이메일 입력 후 포커스 벗어나면 검사
  const onEmailBlur = () => {
    if (email === "") {
      setEmailMessage("");
      return;
    }
    if (!validateEmail(email)) {
      setEmailMessage("유효하지 않은 이메일 형식입니다.");
    } else {
      setEmailMessage("");
    }
  };

  // 비밀번호 입력 중 실시간 검사
  const onPasswordChange = (e) => {
    const pw = e.target.value;
    setPassword(pw);

    if (pw === "") {
      setPasswordMessage("");
      return;
    }

    if (!validatePassword(pw)) {
      setPasswordMessage(
        "비밀번호는 10~16자이며, 영문/숫자/특수문자 중 2가지 이상 포함해야 합니다."
      );
    } else {
      setPasswordMessage("");
    }

    // 비밀번호 확인이 입력되어 있으면 일치 검사 업데이트
    if (repassword !== "") {
      setShowMessage(
        pw === repassword ? "비밀번호가 맞습니다" : "비밀번호가 맞지않습니다"
      );
    }
  };

  // 비밀번호 확인 입력 시
  const passwordHandler = (e) => {
    const repw = e.target.value;
    setRepassword(repw);

    if (password === "" || repw === "") {
      setShowMessage("");
    } else if (password === repw) {
      setShowMessage("비밀번호가 맞습니다");
    } else {
      setShowMessage("비밀번호가 맞지않습니다");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 회원가입 버튼 눌렀을 때 한번 더 전체 검사
    if (!validateEmail(email)) {
      setEmailMessage("유효하지 않은 이메일 형식입니다.");
      return;
    } else {
      setEmailMessage("");
    }

    if (!validatePassword(password)) {
      setPasswordMessage(
        "비밀번호는 10~16자이며, 영문/숫자/특수문자 중 2가지 이상 포함해야 합니다."
      );
      return;
    } else {
      setPasswordMessage("");
    }

    if (password !== repassword) {
      setPasswordMessage("비밀번호가 일치하지 않습니다.");
      return;
    }

    const phoneNumber = `${phonePart1}-${phonePart2}-${phonePart3}`;
    const yymmdd = `${year}-${month}-${day}`;
    const address = `${fullAddress} ${detailAddress}`.trim();
    const userData = {
      id,
      email,
      password,
      repassword,
      name,
      phoneNumber,
      yymmdd,
      zipcode,
      address,
    };

    try {
      const response = await fetch("/api/user/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const result = await response.json();
      alert(result.message || "회원가입 완료!");
      if (response.ok) {
        router.push(result.redirect || "/login");
      }
    } catch (err) {
      alert("에러 발생: " + err.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">회원가입</h2>
        <button
          className="kakao-login"
          onClick={() => handleSocialLogin("kakao")}
        >
          카카오 로그인
        </button>
        <button
          className="social-button naver"
          onClick={() => handleSocialLogin("naver")}
        >
          네이버 로그인
        </button>
        <button className="social-button facebook">Facebook으로 로그인</button>
        <button
          className="social-button google"
          onClick={() => handleSocialLogin("google")}
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" />
          Google 로그인
        </button>
        <div className="form-container">
          <h3>
            기본정보 <span className="required-mark">＊필수입력사항</span>
          </h3>

          <div className="form-group">
            <label>
              아이디 <span className="required">*</span>
            </label>
            <input
              type="text"
              placeholder="아이디 입력"
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>
              비밀번호 <span className="required">*</span>
            </label>
            <input
              type="password"
              placeholder="비밀번호 입력"
              id="pw"
              value={password}
              onChange={onPasswordChange}
            />
            <p className="hint">
              영문 대소문자/숫자/특수문자 중 2가지 이상 조합, 10자~16자
            </p>
            {passwordMessage && (
              <p className="hint" style={{ color: "red" }}>
                {passwordMessage}
              </p>
            )}
          </div>

          <div className="form-group">
            <label>
              비밀번호 확인 <span className="required">*</span>
            </label>
            <input
              type="password"
              placeholder="비밀번호 다시 입력"
              id="repw"
              value={repassword}
              onChange={passwordHandler}
            />
            <p className="hint">{showMessage}</p>
          </div>

          <div className="form-group">
            <label>
              이름 <span className="required">*</span>
            </label>
            <input
              type="text"
              placeholder="이름 입력"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>
              이메일 <span className="required">*</span>
            </label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={onEmailBlur} // 포커스 벗어날 때 검사
            />
            <p className="hint">
              로그인 아이디로 사용할 이메일을 입력해 주세요.
            </p>
            {emailMessage && (
              <p className="hint" style={{ color: "red" }}>
                {emailMessage}
              </p>
            )}
          </div>

          <div className="form-group">
            <label>생년월일</label>
            <div className="phone-row">
              {/* 연도 */}
              <select value={year} onChange={(e) => setYear(e.target.value)}>
                <option value="yy">연도</option>
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>

              {/* 월 */}
              <select value={month} onChange={(e) => setMonth(e.target.value)}>
                <option value="mm">월</option>
                {months.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>

              {/* 일 */}
              <select value={day} onChange={(e) => setDay(e.target.value)}>
                <option value="dd">일</option>
                {getDays().map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <Script
            src="https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
            strategy="beforeInteractive" // 페이지 렌더 전에 로드
          />
          <div className="form-group">
            <label>주소</label>
            <div className="address-row">
              <input
                type="text"
                placeholder="우편번호"
                value={zipcode}
                onChange={(e) => setZipcode(e.target.value)}
              />
              <button type="button" onClick={openDaumPostcode}>
                주소검색
              </button>
            </div>
            <input
              type="text"
              placeholder="기본주소"
              value={fullAddress}
              onChange={(e) => setFullAddress(e.target.value)}
            />
            <input
              type="text"
              placeholder="나머지 주소 (선택 입력 가능)"
              onChange={(e) => setDetailAddress(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>일반전화</label>
            <div className="phone-row">
              <select>
                <option>02</option>
                <option>031</option>
                <option>032</option>
              </select>
              -
              <input type="text" maxLength={4} />
              -
              <input type="text" maxLength={4} />
            </div>
          </div>

          <div className="form-group">
            <label>휴대전화</label>
            <div className="phone-row">
              <select
                value={phonePart1}
                onChange={(e) => setPhonePart1(e.target.value)}
              >
                <option value={"010"}>010</option>
                <option value={"011"}>011</option>
              </select>
              -
              <input
                type="text"
                maxLength={4}
                value={phonePart2}
                onChange={(e) => setPhonePart2(e.target.value)}
              />
              -
              <input
                type="text"
                maxLength={4}
                value={phonePart3}
                onChange={(e) => setPhonePart3(e.target.value)}
              />
            </div>
          </div>

          <button className="login-button" onClick={handleSubmit}>
            회원가입
          </button>
        </div>
      </div>
    </div>
  );
}
