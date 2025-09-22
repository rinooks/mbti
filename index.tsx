// Fix: Import React, hooks, and ReactDOM to resolve reference errors.
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { GoogleGenAI } from "@google/genai";

const ALL_TYPES = [
    'ISTJ', 'ISFJ', 'INFJ', 'INTJ',
    'ISTP', 'ISFP', 'INFP', 'INTP',
    'ESTP', 'ESFP', 'ENFP', 'ENTP',
    'ESTJ', 'ESFJ', 'ENFJ', 'ENTJ'
];

const COMPATIBILITY_DATA = {
    'INFP': { best: ['ENFJ', 'ENTJ'], good: ['INFP', 'ENFP', 'INFJ', 'INTJ', 'INTP', 'ENTP'], bad: ['ISFP', 'ESFP', 'ISTP', 'ESTP', 'ISFJ', 'ESFJ', 'ISTJ', 'ESTJ'] },
    'INFJ': { best: ['ENFP', 'ENTP'], good: ['INFP', 'INFJ', 'ENFJ', 'ENTJ', 'INTJ', 'INTP'], bad: ['ISFP', 'ESFP', 'ISTP', 'ESTP', 'ISFJ', 'ESFJ', 'ISTJ', 'ESTJ'] },
    'ENFP': { best: ['INFJ', 'INTJ'], good: ['INFP', 'ENFP', 'ENFJ', 'ENTJ', 'INTP', 'ENTP'], bad: ['ISFP', 'ESFP', 'ISTP', 'ESTP', 'ISFJ', 'ESFJ', 'ISTJ', 'ESTJ'] },
    'ENFJ': { best: ['INFP', 'ISFP'], good: ['ENFP', 'INFJ', 'ENFJ', 'ENTJ', 'INTJ', 'INTP'], bad: ['ESFJ', 'ISTJ', 'ESTJ', 'ISFJ', 'ESTP', 'ISTP'] },
    'INTJ': { best: ['ENFP', 'ENTP'], good: ['INFP', 'INFJ', 'ENFJ', 'ENTJ', 'INTJ', 'INTP'], bad: ['ISFP', 'ESFP', 'ISTP', 'ESTP', 'ISFJ', 'ESFJ', 'ISTJ', 'ESTJ'] },
    'INTP': { best: ['ESTJ', 'ENTJ'], good: ['INFP', 'ENFP', 'INFJ', 'ENFJ', 'INTJ', 'INTP'], bad: ['ISFP', 'ESFP', 'ISTP', 'ESTP', 'ISFJ', 'ESFJ'] },
    'ENTP': { best: ['INFJ', 'INTJ'], good: ['INFP', 'ENFP', 'ENFJ', 'ENTJ', 'INTP', 'ENTP'], bad: ['ISFP', 'ESFP', 'ISTP', 'ESTP', 'ISFJ', 'ESFJ', 'ISTJ', 'ESTJ'] },
    'ENTJ': { best: ['INFP', 'INTP'], good: ['ENFP', 'INFJ', 'ENFJ', 'ENTJ', 'INTJ', 'ENTP'], bad: ['ESFP', 'ISFP', 'ESTP', 'ISTP', 'ESFJ', 'ISFJ'] },
    'ISFP': { best: ['ENFJ', 'ESFJ', 'ESTJ'], good: ['ISFP', 'ESFP', 'ISTP', 'ESTP', 'ISFJ', 'ISTJ'], bad: ['INFP', 'ENFP', 'INFJ', 'ENFJ'] },
    'ISTP': { best: ['ESFJ', 'ESTJ'], good: ['ISFP', 'ESFP', 'ISTP', 'ESTP', 'ISFJ', 'ISTJ'], bad: ['INFP', 'ENFP', 'INFJ', 'ENFJ'] },
    'ESTP': { best: ['ISFJ', 'ISTJ'], good: ['ISFP', 'ESFP', 'ISTP', 'ESTP', 'ESFJ', 'ESTJ'], bad: ['INFP', 'ENFP', 'INFJ', 'ENFJ'] },
    'ESFP': { best: ['ISFJ', 'ISTJ'], good: ['ISFP', 'ESFP', 'ISTP', 'ESTP', 'ESFJ', 'ESTJ'], bad: ['INFP', 'ENFP', 'INFJ', 'ENFJ'] },
    'ISTJ': { best: ['ESFP', 'ESTP'], good: ['ISFJ', 'ISTJ', 'ESTJ', 'ISFP', 'ISTP'], bad: ['INFP', 'ENFP', 'INFJ', 'ENFJ'] },
    'ISFJ': { best: ['ESFP', 'ESTP'], good: ['ISTJ', 'ISFJ', 'ESFJ', 'ISFP', 'ISTP'], bad: ['INFP', 'ENFP', 'INFJ', 'ENFJ'] },
    'ESTJ': { best: ['INTP', 'ISFP', 'ISTP'], good: ['ESFJ', 'ISTJ', 'ISFJ', 'ESTP', 'ESFP'], bad: ['INFP', 'ENFP', 'INFJ', 'ENFJ'] },
    'ESFJ': { best: ['ISFP', 'ISTP'], good: ['ESFJ', 'ISTJ', 'ISFJ', 'ESTJ', 'ESTP', 'ESFP'], bad: ['INFP', 'ENFP', 'INFJ', 'ENFJ'] },
};

const App = () => {
    const [step, setStep] = useState('welcome');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [scores, setScores] = useState({ E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 });
    const [result, setResult] = useState({ type: '', description: '' });
    const [error, setError] = useState('');
    const [modalContent, setModalContent] = useState(null); // { type: 'INTJ', description: '...' }
    const [isLoadingModal, setIsLoadingModal] = useState(false);
    const [typeDescriptionsCache, setTypeDescriptionsCache] = useState({});

    const questions = [
        { q: "모임이 끝난 후, 당신은 어떤 기분인가요?", a: [{ text: "에너지가 넘치고 더 활동하고 싶다.", type: "E" }, { text: "피곤하고 혼자만의 시간이 필요하다.", type: "I" }] },
        { q: "당신은 주로 어떻게 정보를 인식하나요?", a: [{ text: "현재 일어나고 있는 실제적인 것에 집중한다.", type: "S" }, { text: "미래의 가능성과 숨겨진 의미를 상상한다.", type: "N" }] },
        { q: "결정을 내릴 때 무엇을 더 중요하게 생각하나요?", a: [{ text: "논리적이고 객관적인 사실.", type: "T" }, { text: "사람들과의 관계와 감정.", type: "F" }] },
        { q: "여행 계획을 세울 때 당신의 스타일은?", a: [{ text: "상세한 계획을 미리 세우는 것을 선호한다.", type: "J" }, { text: "상황에 따라 즉흥적으로 결정하는 것을 즐긴다.", type: "P" }] },
        { q: "처음 만나는 사람들과 있을 때 당신은?", a: [{ text: "먼저 말을 걸고 대화를 시작하는 편이다.", type: "E" }, { text: "다른 사람이 말을 걸어주기를 기다리는 편이다.", type: "I" }] },
        { q: "새로운 기술을 배울 때 선호하는 방법은?", a: [{ text: "직접 해보면서 단계별로 배우는 것.", type: "S" }, { text: "전체적인 개념과 원리를 먼저 이해하는 것.", type: "N" }] },
        { q: "친구가 고민을 털어놓을 때 당신의 반응은?", a: [{ text: "문제 해결을 위한 현실적인 조언을 해준다.", type: "T" }, { text: "따뜻한 위로와 공감을 표현한다.", type: "F" }] },
        { q: "당신의 책상은 보통 어떤 상태인가요?", a: [{ text: "항상 깔끔하게 정리정돈 되어 있다.", type: "J" }, { text: "자유롭고 창의적인 혼돈 상태이다.", type: "P" }] },
        { q: "주말에 주로 무엇을 하며 보내나요?", a: [{ text: "친구들과 만나거나 새로운 활동을 찾아 나선다.", type: "E" }, { text: "집에서 책을 읽거나 영화를 보며 조용히 보낸다.", type: "I" }] },
        { q: "영화를 볼 때 당신이 더 흥미를 느끼는 부분은?", a: [{ text: "현실적이고 구체적인 사건 전개.", type: "S" }, { text: "상징적이고 은유적인 메시지.", type: "N" }] },
        { q: "업무를 처리할 때 더 중요한 것은?", a: [{ text: "효율성과 결과 달성.", type: "T" }, { text: "팀의 조화와 협력적인 분위기.", type: "F" }] },
        { q: "마감 기한이 다가올 때 당신은?", a: [{ text: "미리 일을 끝내고 여유를 가진다.", type: "J" }, { text: "마감 직전에 집중해서 일을 처리한다.", type: "P" }] },
        { q: "당신은 자신을 어떤 사람이라고 생각하나요?", a: [{ text: "활동적이고 사교적인 사람.", type: "E" }, { text: "신중하고 내성적인 사람.", type: "I" }] },
        { q: "익숙한 길과 새로운 길 중 어떤 길을 선호하나요?", a: [{ text: "검증되고 확실한 익숙한 길.", type: "S" }, { text: "호기심을 자극하는 새로운 길.", type: "N" }] },
        { q: "비판을 들었을 때 당신의 반응은?", a: [{ text: "객관적으로 받아들이고 개선점을 찾으려 한다.", type: "T" }, { text: "개인적으로 상처를 받고 감정이 상한다.", type: "F" }] },
        { q: "일상생활에서 당신은 어떤 편인가요?", a: [{ text: "체계적이고 예측 가능한 삶을 선호한다.", type: "J" }, { text: "유연하고 자율적인 삶을 선호한다.", type: "P" }] },
        { q: "에너지를 얻는 방식은?", a: [{ text: "다른 사람들과의 교류를 통해 얻는다.", type: "E" }, { text: "혼자만의 시간을 통해 재충전한다.", type: "I" }] },
        { q: "세상을 이해하는 방식은?", a: [{ text: "오감을 통해 직접 경험한 사실을 믿는다.", type: "S" }, { text: "직관과 영감을 통해 통찰을 얻는다.", type: "N" }] },
        { q: "다른 사람을 평가할 때 기준은?", a: [{ text: "그 사람의 능력과 지성.", type: "T" }, { text: "그 사람의 인성과 따뜻함.", type: "F" }] },
        { q: "갑작스러운 변화에 어떻게 반응하나요?", a: [{ text: "미리 대비하고 계획에 차질이 생기는 것을 불편해한다.", type: "J" }, { text: "새로운 가능성으로 여기고 쉽게 적응한다.", type: "P" }] },
    ];

    const handleAnswer = (type) => {
        setScores(prev => ({ ...prev, [type]: prev[type] + 1 }));
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            setStep('loading');
        }
    };
    
    const calculateResult = () => {
        return [
            scores.E >= scores.I ? 'E' : 'I',
            scores.S >= scores.N ? 'S' : 'N',
            scores.T >= scores.F ? 'T' : 'F',
            scores.J >= scores.P ? 'P' : 'P',
        ].join('');
    };

    useEffect(() => {
        if (step === 'loading') {
            const mbtiType = calculateResult();
            fetchDescription(mbtiType, true);
        }
    }, [step]);

    const fetchDescription = async (mbtiType, isMainResult = false) => {
        setError('');
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `MBTI 성격 유형인 ${mbtiType}에 대해 자세히 설명해줘. 주요 특징, 강점, 그리고 보완할 점을 포함해서 전문가가 분석한 것처럼 친절한 말투로 설명해줘.`;
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            const cleanedText = response.text.replace(/\*\*/g, '');

            if (isMainResult) {
                setResult({ type: mbtiType, description: cleanedText });
                setStep('result');
            }
            return cleanedText;
        } catch (err) {
            console.error("Gemini API 호출 오류:", err);
            const errorMsg = '결과를 불러오는 데 실패했습니다. 잠시 후 다시 시도해 주세요.';
            if (isMainResult) {
                setError(errorMsg);
                setResult({ type: mbtiType, description: '오류가 발생하여 설명을 가져올 수 없습니다.' });
                setStep('result');
            }
            return errorMsg;
        }
    };

    const handleViewOtherType = async (type) => {
        if (typeDescriptionsCache[type]) {
            setModalContent({ type, description: typeDescriptionsCache[type] });
            return;
        }

        setIsLoadingModal(true);
        setModalContent({ type, description: '' });
        const description = await fetchDescription(type);
        setTypeDescriptionsCache(prev => ({ ...prev, [type]: description }));
        setModalContent({ type, description });
        setIsLoadingModal(false);
    };

    const restart = () => {
        setStep('welcome');
        setCurrentQuestionIndex(0);
        setScores({ E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 });
        setResult({ type: '', description: '' });
        setError('');
        setTypeDescriptionsCache({});
    };

    const renderDichotomyBar = (type1, type2, name) => {
        const score1 = scores[type1];
        const score2 = scores[type2];
        const total = score1 + score2;
        if (total === 0) return null;
        const percent1 = (score1 / total) * 100;

        return (
            <div className="preference-item">
                <div className="preference-labels">
                    <span>{name.split('/')[0]} ({type1})</span>
                    <span>{name.split('/')[1]} ({type2})</span>
                </div>
                <div className="preference-bar-bg">
                    <div className="preference-bar-fill" style={{ width: `${percent1}%` }}></div>
                </div>
            </div>
        );
    };
    
    const renderContent = () => {
        switch (step) {
            case 'quiz':
                const question = questions[currentQuestionIndex];
                return (
                    <div className="quiz-screen">
                        <div className="progress-bar-container">
                            <div className="progress-bar" style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}></div>
                        </div>
                        <p className="question-counter">질문 {currentQuestionIndex + 1} / {questions.length}</p>
                        <h2 className="question-text">{question.q}</h2>
                        <div className="answer-options">
                            {question.a.map((option, index) => (
                                <button key={index} className="answer-btn" onClick={() => handleAnswer(option.type)}>
                                    {option.text}
                                </button>
                            ))}
                        </div>
                    </div>
                );
            case 'loading':
                return (
                    <div className="loading-screen">
                        <div className="spinner"></div>
                        <p>결과를 분석 중입니다...</p>
                    </div>
                );
            case 'result':
                const compat = COMPATIBILITY_DATA[result.type] || { best: [], good: [], bad: [] };
                return (
                    <div className="result-screen">
                        <div className="result-header">
                            <p>당신의 MBTI 유형은</p>
                            <div className="result-type">{result.type}</div>
                        </div>
                        {error && <p className="error-message">{error}</p>}

                        <div className="result-grid">
                            <div className="result-card main-result-card">
                                <h3>내 유형 분석</h3>
                                <div className="result-description">{result.description}</div>
                            </div>
                            
                            <div className="result-card">
                                <h3>나의 성향 분석</h3>
                                {renderDichotomyBar('E', 'I', '외향/내향')}
                                {renderDichotomyBar('S', 'N', '감각/직관')}
                                {renderDichotomyBar('T', 'F', '사고/감정')}
                                {renderDichotomyBar('J', 'P', '판단/인식')}
                            </div>

                            <div className="result-card">
                                <h3>유형별 궁합</h3>
                                <div className="compatibility-group">
                                    <h4 className="compat-best">천생연분</h4>
                                    <div className="type-tags">{compat.best.map(t => <span key={t} className="type-tag best">{t}</span>)}</div>
                                </div>
                                <div className="compatibility-group">
                                    <h4 className="compat-good">좋은 관계</h4>
                                    <div className="type-tags">{compat.good.map(t => <span key={t} className="type-tag good">{t}</span>)}</div>
                                </div>
                                <div className="compatibility-group">
                                    <h4 className="compat-bad">노력이 필요해요</h4>
                                    <div className="type-tags">{compat.bad.map(t => <span key={t} className="type-tag bad">{t}</span>)}</div>
                                </div>
                            </div>

                             <div className="result-card all-types-card">
                                <h3>다른 유형 살펴보기</h3>
                                <div className="types-grid">
                                    {ALL_TYPES.map(type => (
                                        <button key={type} className="type-button" onClick={() => handleViewOtherType(type)}>
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <button className="btn" onClick={restart}>다시 테스트하기</button>
                    </div>
                );
            case 'welcome':
            default:
                return (
                    <div className="welcome-screen">
                        <h1>온라인 MBTI 진단</h1>
                        <p className="description">나의 성격 유형을 발견해보세요.<br/>20개의 간단한 질문을 통해 당신의 MBTI를 알아볼 수 있습니다.</p>
                        <button className="btn" onClick={() => setStep('quiz')}>테스트 시작하기</button>
                    </div>
                );
        }
    };

    return (
        <div className="app-container">
            {renderContent()}
            {modalContent && (
                <div className="modal-overlay" onClick={() => setModalContent(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{modalContent.type} 유형 분석</h2>
                            <button className="close-button" onClick={() => setModalContent(null)}>&times;</button>
                        </div>
                        <div className="modal-body">
                            {isLoadingModal ? (
                                <div className="spinner-container">
                                    <div className="spinner"></div>
                                </div>
                            ) : (
                                <p>{modalContent.description}</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const container = document.getElementById('root');
if (container) {
    const root = ReactDOM.createRoot(container);
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
}
