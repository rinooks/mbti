import React, { useState, useCallback } from "react";
import ReactDOM from "react-dom/client";

// Types
interface ComponentType {
  id: string;
  name: string;
  icon: string;
}

interface StyleOption {
  id: string;
  name: string;
  color: string;
  icon: string;
}

interface FeatureOption {
  id: string;
  name: string;
}

interface Template {
  id: string;
  name: string;
  icon: string;
  color: string;
  tags: string[];
  description: string;
}

// Data
const QUICK_TEMPLATES: Template[] = [
  { id: 'cta', name: 'CTA 버튼', icon: '🔥', color: '#f97316', tags: [], description: '' },
  { id: 'mobile-card', name: '모바일 카드', icon: '📱', color: '#8b5cf6', tags: [], description: '' },
  { id: 'form', name: '폼 입력', icon: '📋', color: '#f59e0b', tags: [], description: '' },
];

const TEMPLATES: Template[] = [
  { id: 'glass-modal', name: '글래스 모달', icon: '💎', color: '#22c55e', tags: ['glassmorphism', 'animation', 'accessibility'], description: '투명한 글래스 모달' },
  { id: 'dark-nav', name: '다크 네비게이션', icon: '🌙', color: '#f59e0b', tags: ['dark', 'responsive', 'hover'], description: '세련된 다크 네비게이션' },
  { id: 'animation-feedback', name: '애니메이션 피드백', icon: '✨', color: '#ec4899', tags: ['modern', 'animation', 'accessibility'], description: '생동감 있는 피드백 컴포넌트' },
];

const COMPONENT_TYPES: ComponentType[] = [
  { id: 'button', name: '버튼', icon: '⚪' },
  { id: 'card', name: '카드', icon: '📱' },
  { id: 'form', name: '폼', icon: '📝' },
  { id: 'navigation', name: '네비게이션', icon: '🧭' },
  { id: 'modal', name: '모달', icon: '🔵' },
  { id: 'layout', name: '레이아웃', icon: '📐' },
  { id: 'data-display', name: '데이터 표시', icon: '📊' },
  { id: 'feedback', name: '피드백', icon: '💡' },
  { id: 'accessibility', name: '접근성', icon: '♿' },
  { id: 'typography', name: '타이포그래피', icon: '🖼️' },
  { id: 'motion', name: '모션', icon: '🎬' },
  { id: 'scroll', name: '스크롤', icon: '📜' },
  { id: 'page-transition', name: '페이지 전환', icon: '⚡' },
  { id: 'color-gradient', name: '컬러 & 그라디언트', icon: '🌈' },
  { id: 'visual-effects', name: '비주얼 효과', icon: '🎨' },
  { id: 'custom-cursor', name: '커스텀 커서', icon: '👆' },
  { id: 'backend', name: '백엔드', icon: '⚙️' },
  { id: 'security', name: '보안', icon: '🔒' },
  { id: 'data', name: '데이터', icon: '💾' },
  { id: 'devops', name: 'DevOps', icon: '🚀' },
  { id: 'claude-skill', name: 'Claude 스킬', icon: '🤖' },
  { id: 'image', name: '이미지', icon: '🖼️' },
  { id: 'video', name: '영상', icon: '🎥' },
];

const STYLE_OPTIONS: StyleOption[] = [
  { id: 'minimal', name: '미니멀', color: '#3b82f6', icon: '□' },
  { id: 'modern', name: '모던', color: '#8b5cf6', icon: '✦' },
  { id: 'glassmorphism', name: '글래스모피즘', color: '#64748b', icon: '◯' },
  { id: 'gradient', name: '그라데이션', color: '#f97316', icon: '◐' },
  { id: 'dark', name: '다크', color: '#1e293b', icon: '🌙' },
];

const FEATURE_OPTIONS: FeatureOption[] = [
  { id: 'animation', name: '애니메이션' },
  { id: 'responsive', name: '반응형' },
  { id: 'hover', name: '호버 효과' },
  { id: 'accessibility', name: '접근성' },
];

// Generate prompt based on selections
const generatePrompt = (
  componentType: string | null,
  style: string | null,
  features: string[],
  language: 'ko' | 'en'
): string => {
  const component = COMPONENT_TYPES.find(c => c.id === componentType);
  const styleOption = STYLE_OPTIONS.find(s => s.id === style);

  if (!component) {
    return language === 'ko'
      ? '컴포넌트 타입을 선택해주세요.'
      : 'Please select a component type.';
  }

  const selectedFeatures = features.map(f => {
    const feature = FEATURE_OPTIONS.find(fo => fo.id === f);
    return feature?.name || f;
  });

  if (language === 'ko') {
    return `React와 Tailwind CSS를 사용해서 ${styleOption?.name || '모던'}한 스타일의 ${component.name} 컴포넌트를 만들어줘.

요구사항:
${selectedFeatures.length > 0 ? selectedFeatures.map(f => `- ${f}으로 만들어줘.`).join('\n') : '- 반응형으로 만들어줘.'}

기술 스택:
- React (함수형 컴포넌트)
- Tailwind CSS
- TypeScript
- lucide-react (아이콘)`;
  }

  return `Create a ${styleOption?.name || 'modern'} style ${component.name} component using React and Tailwind CSS.

Requirements:
${selectedFeatures.length > 0 ? selectedFeatures.map(f => `- Make it ${f}.`).join('\n') : '- Make it responsive.'}

Tech Stack:
- React (Functional Components)
- Tailwind CSS
- TypeScript
- lucide-react (icons)`;
};

// Preview Component
const PreviewComponent: React.FC<{ componentType: string | null; style: string | null }> = ({
  componentType,
  style
}) => {
  const getPreviewContent = () => {
    const styleClass = style === 'modern' ? 'modern' : style === 'minimal' ? 'minimal' : '';

    switch (componentType) {
      case 'button':
        return (
          <div className={`preview-button-demo ${styleClass}`}>
            <button className="demo-button">Button</button>
          </div>
        );
      case 'card':
        return (
          <div className={`preview-card-demo ${styleClass}`}>
            <div className="demo-card">
              <div className="demo-card-header"></div>
              <div className="demo-card-body">
                <div className="demo-card-line"></div>
                <div className="demo-card-line short"></div>
              </div>
            </div>
          </div>
        );
      case 'form':
        return (
          <div className={`preview-form-demo ${styleClass}`}>
            <div className="demo-input"></div>
            <div className="demo-input"></div>
            <button className="demo-button small">Submit</button>
          </div>
        );
      case 'navigation':
        return (
          <div className={`preview-nav-demo ${styleClass}`}>
            <div className="demo-nav-item active"></div>
            <div className="demo-nav-item"></div>
            <div className="demo-nav-item"></div>
          </div>
        );
      case 'modal':
        return (
          <div className={`preview-modal-demo ${styleClass}`}>
            <div className="demo-modal">
              <div className="demo-modal-header"></div>
              <div className="demo-modal-body"></div>
            </div>
          </div>
        );
      default:
        return (
          <div className="preview-placeholder">
            <span>컴포넌트를 선택하세요</span>
          </div>
        );
    }
  };

  const componentName = COMPONENT_TYPES.find(c => c.id === componentType)?.name || 'Component';

  return (
    <div className="preview-container">
      <div className="preview-header">
        <span className="preview-indicator"></span>
        <span className="preview-name">{componentType ? `Primary${componentName.replace(' ', '')}` : 'Preview'}</span>
      </div>
      <div className="preview-window">
        <div className="preview-window-header">
          <div className="window-dots">
            <span className="dot red"></span>
            <span className="dot yellow"></span>
            <span className="dot green"></span>
          </div>
          {style && <span className="style-badge">{style?.toUpperCase()}</span>}
        </div>
        <div className="preview-content">
          {getPreviewContent()}
        </div>
        {componentType && <span className="responsive-badge">responsive</span>}
      </div>
    </div>
  );
};

// Main App Component
const App: React.FC = () => {
  const [selectedComponent, setSelectedComponent] = useState<string | null>('button');
  const [selectedStyle, setSelectedStyle] = useState<string | null>('modern');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(['responsive']);
  const [promptLanguage, setPromptLanguage] = useState<'ko' | 'en'>('ko');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const handleComponentSelect = useCallback((id: string) => {
    setSelectedComponent(prev => prev === id ? null : id);
  }, []);

  const handleStyleSelect = useCallback((id: string) => {
    setSelectedStyle(prev => prev === id ? null : id);
  }, []);

  const handleFeatureToggle = useCallback((id: string) => {
    setSelectedFeatures(prev =>
      prev.includes(id)
        ? prev.filter(f => f !== id)
        : [...prev, id]
    );
  }, []);

  const handleQuickTemplate = useCallback((template: Template) => {
    switch (template.id) {
      case 'cta':
        setSelectedComponent('button');
        setSelectedStyle('gradient');
        setSelectedFeatures(['animation', 'hover']);
        break;
      case 'mobile-card':
        setSelectedComponent('card');
        setSelectedStyle('modern');
        setSelectedFeatures(['responsive', 'animation']);
        break;
      case 'form':
        setSelectedComponent('form');
        setSelectedStyle('minimal');
        setSelectedFeatures(['responsive', 'accessibility']);
        break;
    }
  }, []);

  const handleTemplateSelect = useCallback((template: Template) => {
    switch (template.id) {
      case 'glass-modal':
        setSelectedComponent('modal');
        setSelectedStyle('glassmorphism');
        setSelectedFeatures(['animation', 'accessibility']);
        break;
      case 'dark-nav':
        setSelectedComponent('navigation');
        setSelectedStyle('dark');
        setSelectedFeatures(['responsive', 'hover']);
        break;
      case 'animation-feedback':
        setSelectedComponent('feedback');
        setSelectedStyle('modern');
        setSelectedFeatures(['animation', 'accessibility']);
        break;
    }
  }, []);

  const handleCopyPrompt = useCallback(async () => {
    const prompt = generatePrompt(selectedComponent, selectedStyle, selectedFeatures, promptLanguage);
    try {
      await navigator.clipboard.writeText(prompt);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [selectedComponent, selectedStyle, selectedFeatures, promptLanguage]);

  const generatedPrompt = generatePrompt(selectedComponent, selectedStyle, selectedFeatures, promptLanguage);

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <span className="logo-icon">✨</span>
          <h1 className="title">프롬프트 빌더</h1>
        </div>
        <p className="subtitle">옵션을 선택하면 프롬프트가 자동으로 생성됩니다</p>
        <button className="history-btn">
          <span>🕐</span> 히스토리
        </button>
      </header>

      {/* Quick Templates */}
      <section className="section">
        <h2 className="section-title">
          <span className="section-icon">✨</span>
          빠른 시작 템플릿
        </h2>
        <div className="quick-templates">
          {QUICK_TEMPLATES.map(template => (
            <button
              key={template.id}
              className="quick-template-btn"
              style={{ '--accent-color': template.color } as React.CSSProperties}
              onClick={() => handleQuickTemplate(template)}
            >
              <span className="template-icon">{template.icon}</span>
              <span className="template-name">{template.name}</span>
              <span className="template-arrow">📄</span>
            </button>
          ))}
        </div>
      </section>

      {/* Navigation Bar (decorative) */}
      <div className="nav-bar">
        <div className="nav-logo">
          <span className="nav-logo-icon">✨</span>
          <span>VibePrompt</span>
        </div>
        <nav className="nav-links">
          <a href="#" className="nav-link">홈</a>
          <a href="#" className="nav-link">갤러리</a>
          <a href="#" className="nav-link">빌더</a>
          <a href="#" className="nav-link">가이드</a>
        </nav>
        <div className="nav-right">
          <button className="lang-btn">🌐 EN</button>
          <button className="user-btn">👤 mane23.ai</button>
        </div>
      </div>

      {/* Template Cards */}
      <section className="template-cards">
        {TEMPLATES.map(template => (
          <div
            key={template.id}
            className="template-card"
            onClick={() => handleTemplateSelect(template)}
          >
            <div className="template-card-icon" style={{ color: template.color }}>
              {template.icon}
            </div>
            <div className="template-card-content">
              <h3>{template.name}</h3>
              <p>{template.description}</p>
              <div className="template-tags">
                {template.tags.map(tag => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            </div>
            <span className="template-card-indicator" style={{ background: template.color }}></span>
          </div>
        ))}
      </section>

      {/* Main Content */}
      <div className="main-content">
        {/* Left Panel */}
        <div className="left-panel">
          {/* Component Types */}
          <section className="panel-section">
            <h2 className="panel-title">
              <span className="panel-icon">⚙️</span>
              컴포넌트 타입
            </h2>
            <div className="component-grid">
              {COMPONENT_TYPES.map(component => (
                <button
                  key={component.id}
                  className={`component-btn ${selectedComponent === component.id ? 'active' : ''}`}
                  onClick={() => handleComponentSelect(component.id)}
                >
                  <span className="component-icon">{component.icon}</span>
                  <span className="component-name">{component.name}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Styles */}
          <section className="panel-section">
            <h2 className="panel-title">
              <span className="panel-icon">🎨</span>
              스타일
            </h2>
            <div className="style-options">
              {STYLE_OPTIONS.map(style => (
                <button
                  key={style.id}
                  className={`style-btn ${selectedStyle === style.id ? 'active' : ''}`}
                  onClick={() => handleStyleSelect(style.id)}
                >
                  <div
                    className="style-preview"
                    style={{ background: style.color }}
                  >
                    {style.id === 'glassmorphism' && <div className="glass-line"></div>}
                    {style.id === 'gradient' && <div className="gradient-circle"></div>}
                    {style.id === 'dark' && <div className="dark-line"></div>}
                    {style.id === 'minimal' && <div className="minimal-box"></div>}
                    {style.id === 'modern' && <div className="modern-star">✦</div>}
                  </div>
                  <span className="style-icon">{style.icon}</span>
                  <span className="style-name">{style.name}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Features */}
          <section className="panel-section">
            <h2 className="panel-title">
              <span className="panel-icon">✨</span>
              기능
            </h2>
            <div className="feature-options">
              {FEATURE_OPTIONS.map(feature => (
                <button
                  key={feature.id}
                  className={`feature-btn ${selectedFeatures.includes(feature.id) ? 'active' : ''}`}
                  onClick={() => handleFeatureToggle(feature.id)}
                >
                  <span className="feature-check">
                    {selectedFeatures.includes(feature.id) ? '✓' : '○'}
                  </span>
                  <span>{feature.name}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Advanced Options */}
          <section className="panel-section advanced-section">
            <button
              className="advanced-toggle"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <span className="panel-icon">⚙️</span>
              <span>세부 옵션</span>
              <span className="advanced-badge">고급</span>
              <span className={`arrow ${showAdvanced ? 'open' : ''}`}>▼</span>
            </button>
            {showAdvanced && (
              <div className="advanced-content">
                <p>추가 세부 옵션이 여기에 표시됩니다.</p>
              </div>
            )}
          </section>
        </div>

        {/* Right Panel */}
        <div className="right-panel">
          {/* Preview */}
          <section className="panel-section preview-section">
            <h2 className="panel-title">
              <span className="panel-icon">👁️</span>
              미리보기
            </h2>
            <PreviewComponent
              componentType={selectedComponent}
              style={selectedStyle}
            />
          </section>

          {/* Generated Prompt */}
          <section className="panel-section prompt-section">
            <div className="prompt-header">
              <h2 className="panel-title">
                <span className="panel-icon">✨</span>
                생성된 프롬프트
              </h2>
              <div className="language-toggle">
                <button
                  className={`lang-toggle-btn ${promptLanguage === 'ko' ? 'active' : ''}`}
                  onClick={() => setPromptLanguage('ko')}
                >
                  한국어
                </button>
                <button
                  className={`lang-toggle-btn ${promptLanguage === 'en' ? 'active' : ''}`}
                  onClick={() => setPromptLanguage('en')}
                >
                  English
                </button>
              </div>
            </div>
            <div className="prompt-content">
              <pre>{generatedPrompt}</pre>
              <button className="copy-btn" onClick={handleCopyPrompt}>
                {copiedPrompt ? '✓ 복사됨' : '📋 복사'}
              </button>
            </div>
          </section>

          {/* Tip */}
          <div className="tip-box">
            <span className="tip-icon">💡</span>
            <div className="tip-content">
              <strong>팁</strong>
              <p>세부 옵션을 활성화하면 더 구체적인 프롬프트를 생성할 수 있습니다. 색상, 크기, 변형 등을 세밀하게 조절해보세요!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-left">
          <span className="footer-logo">✨</span>
          <span>© 2024 VibePrompt. All rights reserved.</span>
        </div>
        <div className="footer-right">
          Made with <span className="heart">❤️</span> for vibe coders
        </div>
      </footer>
    </div>
  );
};

// Render
const container = document.getElementById('root');
if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
