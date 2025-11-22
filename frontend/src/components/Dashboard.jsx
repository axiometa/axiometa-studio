import React, { useState, useEffect } from 'react';
import { connectionService } from '../services/connection';
import BoardSelector from './dashboard/BoardSelector';
import ConnectionStatus from './dashboard/ConnectionStatus';
import LessonCard from './dashboard/LessonCard';
import LockedLesson from './dashboard/LockedLesson';
import ModuleCard from './dashboard/ModuleCard';
import Card from './common/Card';
import Button from './common/Button';
import TabNavigation from './common/TabNavigation';
import AIAssistant from './AIAssistant';
import { BOARDS, getBoardById } from '../constants/boards';
import { ALL_MODULES, setModules, getModulesByCategory, MODULE_CATEGORIES, getModuleUsageCount } from '../constants/modules';
import { fetchAllModulesFromShopify } from '../utils/shopifyCollectionFetcher';
import { lessons, getLessonsByBoard, getLessonMetadata } from '../data/lessons';
import { colors, gradients, fontFamily } from '../styles/theme';

const styles = {
  dashboard: {
    minHeight: '100vh',
    background: colors.background,
    padding: '2rem',
    fontFamily
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  logo: {
    height: '40px',
    width: 'auto'
  },
  studioText: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#fff'
  },
  stats: {
    display: 'flex',
    gap: '2rem'
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  statLabel: {
    fontSize: '0.875rem',
    color: colors.text.muted,
    marginBottom: '0.25rem',
    fontFamily
  },
  statValue: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: colors.primary,
    fontFamily
  },
  progressBarContainer: {
    width: '100%',
    height: '6px',
    background: '#1a1a1a',
    borderRadius: '3px',
    overflow: 'hidden',
    marginBottom: '2rem'
  },
  progressBar: {
    height: '100%',
    background: gradients.primary,
    transition: 'width 0.3s ease'
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  compactConnection: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '2rem',
    alignItems: 'center'
  },
  sectionTitle: {
    fontSize: '1.25rem',
    marginBottom: '1rem',
    color: '#fff',
    fontFamily,
    fontWeight: 'bold'
  }
};

const TABS = [
  { id: 'lessons', label: 'Learning Path' },
  { id: 'modules', label: 'My Modules & Parts' },
  { id: 'projects', label: 'Projects' },
  { id: 'sandbox', label: 'Sandbox' }
];

export default function Dashboard({ userProgress, onStartLesson, onOpenSandbox }) {
  const { level, xp, nextLevelXp } = userProgress;
  const xpPercentage = (xp / nextLevelXp) * 100;
  
  const [isConnected, setIsConnected] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState('axiometa_pixie_m1');
  const [isConnecting, setIsConnecting] = useState(false);
  const [activeTab, setActiveTab] = useState('lessons');
  const [ownedModules, setOwnedModules] = useState([
  'MTA0007',        // PIXIE M1
  'AX22-0006',      // RGB LED
  'AX22-0007',      // Push Button
  'TOOL-BB-001',    // Breadboard
  'TOOL-JW-001'     // Jumper Wires
]);
  const [loadingModules, setLoadingModules] = useState(true);

  const currentBoard = getBoardById(selectedBoard);

  // Fetch ALL modules from Shopify collection on mount
  useEffect(() => {
    async function loadModules() {
      setLoadingModules(true);
      const shopifyModules = await fetchAllModulesFromShopify();
      
      if (shopifyModules.length > 0) {
        setModules(shopifyModules);
      }
      
      setLoadingModules(false);
    }
    loadModules();
  }, []);

  useEffect(() => {
    const checkConnection = async () => {
      if (connectionService.getConnectionStatus()) {
        setIsConnected(true);
      }
    };
    checkConnection();
  }, []);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await connectionService.connect();
      setIsConnected(true);
    } catch (error) {
      console.error('Connection failed:', error);
      alert('Failed to connect to ESP32. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const toggleModule = (moduleId) => {
    setOwnedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const hasRequiredModules = (lesson) => {
    if (!lesson.requiredModules) return true;
    return lesson.requiredModules.every(id => ownedModules.includes(id));
  };

  return (
    <div style={styles.dashboard}>
      <div style={styles.header}>
        <div style={styles.logoContainer}>
          <img 
            src="https://cdn.shopify.com/s/files/1/0966/7756/0659/files/white_logo.png" 
            alt="Axiometa" 
            style={styles.logo}
          />
          <span style={styles.studioText}>Studio</span>
        </div>
        <div style={styles.stats}>
          <div style={styles.statItem}>
            <span style={styles.statLabel}>Level</span>
            <span style={styles.statValue}>{level}</span>
          </div>
          <div style={styles.statItem}>
            <span style={styles.statLabel}>XP</span>
            <span style={styles.statValue}>{xp} / {nextLevelXp}</span>
          </div>
        </div>
      </div>

      <div style={styles.progressBarContainer}>
        <div style={{ ...styles.progressBar, width: `${xpPercentage}%` }} />
      </div>

      <div style={styles.content}>
        <Card style={{ marginBottom: '2rem' }}>
          <h3 style={styles.sectionTitle}>Device Connection</h3>
          <div style={styles.compactConnection}>
            <BoardSelector 
              selectedBoard={selectedBoard}
              onBoardSelect={setSelectedBoard}
            />
            <ConnectionStatus
              isConnected={isConnected}
              isConnecting={isConnecting}
              boardName={currentBoard?.name}
              onConnect={handleConnect}
            />
          </div>
        </Card>

        <TabNavigation 
          tabs={TABS} 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
        >
          {activeTab === 'lessons' && (
            <LessonsTab 
              board={currentBoard}
              hasRequiredModules={hasRequiredModules}
              onStartLesson={onStartLesson}
            />
          )}
          
          {activeTab === 'modules' && (
            <ModulesTab 
              modules={ALL_MODULES}
              ownedModules={ownedModules}
              onToggleModule={toggleModule}
              lessons={lessons}
              loadingModules={loadingModules}
            />
          )}
          
          {activeTab === 'projects' && <ProjectsTab />}
          
          {activeTab === 'sandbox' && (
            <SandboxTab 
              isConnected={isConnected}
              onOpenSandbox={onOpenSandbox}
            />
          )}
        </TabNavigation>
      </div>

      <AIAssistant
        lesson={{ id: 'dashboard', title: 'Dashboard', board: 'pixie-m1', steps: [] }}
        currentStep={{
          id: 'dashboard',
          type: 'info',
          title: 'Getting Started',
          instruction: 'Browse lessons, manage your modules, or ask me anything about hardware programming!'
        }}
        userCode=""
        validationError={null}
      />
    </div>
  );
}

function LessonsTab({ board, hasRequiredModules, onStartLesson }) {
  if (!board?.available) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔒</div>
        <h3 style={{ fontSize: '2rem', color: colors.text.muted, marginBottom: '1rem', fontFamily }}>
          {board?.name} Learning Path
        </h3>
        <p style={{ fontSize: '1.125rem', color: colors.text.tertiary, marginBottom: '0.5rem', fontFamily }}>
          {board?.lessonCount} lessons available when this board launches
        </p>
        <p style={{ fontSize: '1rem', color: colors.primary, fontFamily }}>
          Select Pixie M1 above to start learning now!
        </p>
      </div>
    );
  }

  const boardLessons = getLessonsByBoard(board.lessonBoard);
  
  return (
    <div>
      <LevelSection 
        title="Available Lessons"
        lessonCount={boardLessons.length}
      >
        {boardLessons.map((lesson, index) => {
          const metadata = getLessonMetadata(lesson);
          
          return (
            <LessonCard
              key={lesson.id}
              lessonNumber={index + 1}
              boardName={board.name}
              title={metadata.title}
              description={lesson.steps[0]?.content || 'Learn something new!'}
              duration={metadata.duration}
              xp={metadata.xpReward}
              challenges={metadata.challenges}
              hasRequiredParts={hasRequiredModules(lesson)}
              onStart={() => onStartLesson(lesson)}
            />
          );
        })}
      </LevelSection>

      <LevelSection 
        title="Coming Soon"
        description="More lessons are being created!"
        lessonCount={3}
      >
        <LockedLesson title="More lessons coming soon!" unlockText="Complete available lessons" />
      </LevelSection>
    </div>
  );
}

function LevelSection({ title, description, lessonCount, children }) {
  return (
    <div style={{ marginBottom: '3rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
        <h3 style={{ fontSize: '1.75rem', color: colors.text.primary, fontWeight: 'bold', fontFamily, margin: 0 }}>
          {title}
        </h3>
        <span style={{
          background: 'rgba(225, 241, 79, 0.88)',
          color: '#000',
          padding: '0.25rem 0.75rem',
          borderRadius: '12px',
          fontSize: '0.875rem',
          fontWeight: '600',
          fontFamily
        }}>
          {lessonCount} lessons
        </span>
      </div>
      <p style={{ color: colors.text.tertiary, fontSize: '1rem', marginBottom: '1.5rem', fontFamily }}>
        {description}
      </p>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '1rem',
        alignItems: 'stretch'
      }}>
        {children}
      </div>
    </div>
  );
}

function ModulesTab({ modules, ownedModules, onToggleModule, lessons, loadingModules }) {
  return (
    <div>
      <p style={{ color: colors.text.tertiary, marginBottom: '1.5rem', fontSize: '0.95rem', fontFamily }}>
        {loadingModules 
          ? '🔄 Loading modules...' 
          : `✓ Loaded ${modules.length} items. Track which ones you own to see available lessons.`
        }
      </p>
      {Object.values(MODULE_CATEGORIES).map(category => {
        const categoryModules = getModulesByCategory(category);
        
        if (categoryModules.length === 0) return null;
        
        return (
          <div key={category} style={{ marginBottom: '3rem' }}>
            <h3 style={{
              fontSize: '1.25rem',
              color: colors.primary,
              marginBottom: '1rem',
              fontWeight: '600',
              fontFamily,
              paddingBottom: '0.5rem',
              borderBottom: '2px solid rgba(0, 212, 170, 0.2)'
            }}>
              {category}
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '1rem'
            }}>
              {categoryModules.map(module => {
                const usageCount = getModuleUsageCount(module.id, lessons);
                return (
                  <ModuleCard
                    key={module.id}
                    module={{ ...module, requiredFor: usageCount }}
                    isOwned={ownedModules.includes(module.id)}
                    onToggle={() => onToggleModule(module.id)}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ProjectsTab() {
  return (
    <div style={{ textAlign: 'center', padding: '3rem 2rem' }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🚀</div>
      <h2 style={{ fontSize: '2.5rem', color: '#fff', marginBottom: '1rem', fontFamily, fontWeight: 'bold' }}>
        Projects Coming Soon!
      </h2>
      <p style={{ fontSize: '1.25rem', color: colors.text.tertiary, marginBottom: '3rem', fontFamily }}>
        Build real-world IoT devices with step-by-step project guides
      </p>
    </div>
  );
}

function SandboxTab({ isConnected, onOpenSandbox }) {
  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#fff', fontFamily }}>
        Creative Sandbox
      </h2>
      <p style={{ color: colors.text.tertiary, marginBottom: '2rem', fontSize: '1rem', lineHeight: '1.6', fontFamily }}>
        Experiment freely without structured lessons. Write your own code and test ideas.
      </p>
      <Button disabled={!isConnected} onClick={onOpenSandbox}>
        {isConnected ? 'Open Sandbox' : 'Connect Device First'}
      </Button>
    </div>
  );
}