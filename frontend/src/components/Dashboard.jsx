import React, { useState, useEffect } from 'react';
import { connectionService } from '../services/connection';
import AIAssistant from './AIAssistant';

export default function Dashboard({ userProgress, onStartLesson, onOpenSandbox }) {
  const { level, xp, nextLevelXp } = userProgress;
  const xpPercentage = (xp / nextLevelXp) * 100;
  
  const [isConnected, setIsConnected] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState('axiometa_pixie_m1');
  const [isConnecting, setIsConnecting] = useState(false);
  const [activeTab, setActiveTab] = useState('lessons');
  const [ownedModules, setOwnedModules] = useState([
    'LED',
    'BREADBOARD',
    'JUMPER_WIRES'
  ]);

  // Map board IDs to lesson board names
  const boardToLessonMap = {
    'axiometa_pixie_m1': 'pixie-m1',
    'spark_3': 'spark-3',
    'genesis_mini': 'genesis-mini',
    'genesis_one': 'genesis-one'
  };

  const currentLessonBoard = boardToLessonMap[selectedBoard] || 'pixie-m1';

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

  const boards = [
    {
      id: 'axiometa_pixie_m1',
      name: 'PIXIE M1',
      available: true,
      fqbn: 'esp32:esp32:axiometa_pixie_m1:CDCOnBoot=cdc',
      lessonCount: 8
    },
    {
      id: 'spark_3',
      name: 'SPARK 3',
      available: false,
      fqbn: null,
      lessonCount: 6
    },
    {
      id: 'genesis_mini',
      name: 'GENESIS MINI',
      available: false,
      fqbn: null,
      lessonCount: 10
    },
    {
      id: 'genesis_one',
      name: 'GENESIS ONE',
      available: false,
      fqbn: null,
      lessonCount: 12
    }
  ];

  const allModules = [
    {
      id: 'LED',
      name: 'LED Module',
      image: '/images/ax22-components/AX22-0006.png',
      description: 'Light Emitting Diode',
      category: 'Modules',
      requiredFor: ['lesson-1'],
      purchaseUrl: 'https://axiometa.com/products/led-module'
    },
    {
      id: 'BUTTON',
      name: 'Button Module',
      image: '/images/ax22-components/button.png',
      description: 'Push Button Sensor',
      category: 'Modules',
      requiredFor: ['lesson-2'],
      purchaseUrl: 'https://axiometa.com/products/button-module'
    },
    {
      id: 'POTENTIOMETER',
      name: 'Potentiometer',
      image: '/images/ax22-components/pot.png',
      description: 'Variable Resistor',
      category: 'Modules',
      requiredFor: ['lesson-3'],
      purchaseUrl: 'https://axiometa.com/products/potentiometer'
    },
    {
      id: 'BREADBOARD',
      name: 'Breadboard',
      image: '/images/misc/breadboard.png',
      description: 'Solderless Prototyping Board',
      category: 'Tools',
      requiredFor: ['lesson-1'],
      purchaseUrl: 'https://axiometa.com/products/breadboard'
    },
    {
      id: 'JUMPER_WIRES',
      name: 'Jumper Wires',
      image: '/images/misc/jumper-wires.png',
      description: 'Connection Wires',
      category: 'Tools',
      requiredFor: ['lesson-1'],
      purchaseUrl: 'https://axiometa.com/products/jumper-wires'
    }
  ];

  const categories = ['Modules', 'Tools'];

  const boardFilterOptions = [
    { id: 'all', name: 'All Boards', fqbn: null },
    { id: 'pixie-m1', name: 'Pixie M1', fqbn: 'esp32:esp32:axiometa_pixie_m1:CDCOnBoot=cdc' },
    { id: 'spark-3', name: 'Spark 3', fqbn: null },
    { id: 'genesis-mini', name: 'Genesis Mini', fqbn: null },
  ];

  const toggleModule = (moduleId) => {
    setOwnedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const hasRequiredModules = (lessonId) => {
    const required = allModules
      .filter(m => m.requiredFor.includes(lessonId))
      .map(m => m.id);
    return required.every(id => ownedModules.includes(id));
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
        <div style={styles.connectionCard}>
          <h3 style={styles.sectionTitle}>Device Connection</h3>
          
          <div style={styles.compactConnection}>
            <div style={styles.boardSelector}>
              <label style={styles.label}>Microcontroller:</label>
              <div style={styles.boardGrid}>
                {boards.map(board => (
                  <button
                    key={board.id}
                    style={{
                      ...styles.boardButton,
                      ...(selectedBoard === board.id ? styles.boardButtonActive : {}),
                      ...((!board.available) ? styles.boardButtonDisabled : {})
                    }}
                    onClick={() => board.available && setSelectedBoard(board.id)}
                    disabled={!board.available}
                  >
                    <span style={styles.boardName}>{board.name}</span>
                    {!board.available && (
                      <span style={styles.comingSoonBadge}>Soon</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div style={styles.connectionStatus}>
              {!isConnected ? (
                <button 
                  style={styles.connectButton} 
                  onClick={handleConnect}
                  disabled={isConnecting}
                >
                  {isConnecting ? 'Connecting...' : 'Connect Device'}
                </button>
              ) : (
                <div style={styles.connectedBadge}>
                  Connected to {boards.find(b => b.id === selectedBoard)?.name}
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={styles.tabContainer}>
          <div style={styles.tabs}>
            <button 
              style={activeTab === 'lessons' ? styles.tabActive : styles.tab}
              onClick={() => setActiveTab('lessons')}
            >
              Learning Path
            </button>
            <button 
              style={activeTab === 'modules' ? styles.tabActive : styles.tab}
              onClick={() => setActiveTab('modules')}
            >
              My Modules & Parts
            </button>
            <button 
              style={activeTab === 'projects' ? styles.tabActive : styles.tab}
              onClick={() => setActiveTab('projects')}
            >
              Projects
            </button>
            <button 
              style={activeTab === 'sandbox' ? styles.tabActive : styles.tab}
              onClick={() => setActiveTab('sandbox')}
            >
              Sandbox
            </button>
          </div>

          <div style={styles.tabContent}>
            {activeTab === 'lessons' && (
              <div>
                {boards.find(b => b.id === selectedBoard)?.available ? (
                  <>
                    <div style={styles.levelSection}>
                      <div style={styles.levelHeader}>
                        <h3 style={styles.levelTitle}>Beginner</h3>
                        <span style={styles.levelBadge}>3 lessons</span>
                      </div>
                      <p style={styles.levelDescription}>
                        Start here! Learn the fundamentals of hardware programming.
                      </p>
                      
                      <div style={styles.lessonCard}>
                        <div style={styles.lessonHeader}>
                          <div>
                            <div style={styles.lessonBadge}>
                              Lesson 1 • {boards.find(b => b.id === selectedBoard)?.name}
                            </div>
                            <h3 style={styles.lessonTitle}>Blinky - Your First LED</h3>
                            <p style={styles.lessonDescription}>
                              Learn the basics of controlling an LED with digitalWrite()
                            </p>
                          </div>
                          {hasRequiredModules('lesson-1') ? (
                            <div style={styles.checkmark}>✓</div>
                          ) : (
                            <div style={styles.missingParts}>Missing Parts</div>
                          )}
                        </div>
                        <div style={styles.lessonMeta}>
                          <span style={styles.metaItem}>15 min</span>
                          <span style={styles.metaItem}>100 XP</span>
                          <span style={styles.metaItem}>3 Challenges</span>
                        </div>
                        <button 
                          style={hasRequiredModules('lesson-1') ? styles.startButton : styles.startButtonDisabled}
                          onClick={onStartLesson}
                          disabled={!hasRequiredModules('lesson-1')}
                        >
                          {hasRequiredModules('lesson-1') ? 'Start Learning' : 'Get Required Parts'}
                        </button>
                      </div>

                      <div style={styles.comingSoon}>
                        <div style={styles.lockedLesson}>
                          <div style={styles.lockIcon}>🔒</div>
                          <h4 style={styles.lockedTitle}>Lesson 2: Button Input</h4>
                          <p style={styles.lockedText}>Complete Lesson 1 to unlock</p>
                        </div>
                        <div style={styles.lockedLesson}>
                          <div style={styles.lockIcon}>🔒</div>
                          <h4 style={styles.lockedTitle}>Lesson 3: Serial Communication</h4>
                          <p style={styles.lockedText}>Complete Lesson 2 to unlock</p>
                        </div>
                      </div>
                    </div>

                    <div style={styles.levelSection}>
                      <div style={styles.levelHeader}>
                        <h3 style={styles.levelTitle}>Intermediate</h3>
                        <span style={styles.levelBadge}>3 lessons</span>
                      </div>
                      <p style={styles.levelDescription}>
                        Build on the basics with sensors, displays, and analog control.
                      </p>

                      <div style={styles.comingSoon}>
                        <div style={styles.lockedLesson}>
                          <div style={styles.lockIcon}>🔒</div>
                          <h4 style={styles.lockedTitle}>Lesson 4: PWM & Brightness</h4>
                          <p style={styles.lockedText}>Complete Beginner level to unlock</p>
                        </div>
                        <div style={styles.lockedLesson}>
                          <div style={styles.lockIcon}>🔒</div>
                          <h4 style={styles.lockedTitle}>Lesson 5: Analog Sensors</h4>
                          <p style={styles.lockedText}>Complete Lesson 4 to unlock</p>
                        </div>
                        <div style={styles.lockedLesson}>
                          <div style={styles.lockIcon}>🔒</div>
                          <h4 style={styles.lockedTitle}>Lesson 6: LCD Display</h4>
                          <p style={styles.lockedText}>Complete Lesson 5 to unlock</p>
                        </div>
                      </div>
                    </div>

                    <div style={styles.levelSection}>
                      <div style={styles.levelHeader}>
                        <h3 style={styles.levelTitle}>Advanced</h3>
                        <span style={styles.levelBadge}>2 lessons</span>
                      </div>
                      <p style={styles.levelDescription}>
                        Master advanced concepts like wireless communication and real-time systems.
                      </p>

                      <div style={styles.comingSoon}>
                        <div style={styles.lockedLesson}>
                          <div style={styles.lockIcon}>🔒</div>
                          <h4 style={styles.lockedTitle}>Lesson 7: WiFi Connectivity</h4>
                          <p style={styles.lockedText}>Complete Intermediate level to unlock</p>
                        </div>
                        <div style={styles.lockedLesson}>
                          <div style={styles.lockIcon}>🔒</div>
                          <h4 style={styles.lockedTitle}>Lesson 8: IoT Project</h4>
                          <p style={styles.lockedText}>Complete Lesson 7 to unlock</p>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div style={styles.unavailableBoard}>
                    <div style={styles.unavailableIcon}>🔒</div>
                    <h3 style={styles.unavailableTitle}>
                      {boards.find(b => b.id === selectedBoard)?.name} Learning Path
                    </h3>
                    <p style={styles.unavailableText}>
                      {boards.find(b => b.id === selectedBoard)?.lessonCount} lessons available when this board launches
                    </p>
                    <p style={styles.unavailableSubtext}>
                      Select Pixie M1 above to start learning now!
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'modules' && (
              <div>
                <p style={styles.moduleDescription}>
                  Track your sensor modules and tools to see which lessons you can complete.
                </p>
                {categories.map(category => (
                  <div key={category} style={styles.categorySection}>
                    <h3 style={styles.categoryTitle}>{category}</h3>
                    <div style={styles.moduleGrid}>
                      {allModules
                        .filter(module => module.category === category)
                        .map(module => (
                          <div 
                            key={module.id}
                            style={{
                              ...styles.moduleCard,
                              ...(ownedModules.includes(module.id) ? styles.moduleCardOwned : {})
                            }}
                          >
                            <div 
                              style={styles.moduleClickArea}
                              onClick={() => toggleModule(module.id)}
                            >
                              <div style={styles.moduleCheckbox}>
                                {ownedModules.includes(module.id) && <span style={styles.checkIcon}>✓</span>}
                              </div>
                              <div style={styles.moduleImageContainer}>
                                <img 
                                  src={module.image} 
                                  alt={module.name}
                                  style={styles.moduleImage}
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                  }}
                                />
                              </div>
                              <h4 style={styles.moduleName}>{module.name}</h4>
                              <p style={styles.moduleDesc}>{module.description}</p>
                              {module.requiredFor.length > 0 && (
                                <div style={styles.requiredFor}>
                                  Required for {module.requiredFor.length} lesson(s)
                                </div>
                              )}
                            </div>
                            <a 
                              href={module.purchaseUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={styles.purchaseLink}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <span style={styles.infoIcon}>ⓘ</span> Learn More
                            </a>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'projects' && (
              <div style={styles.projectsComingSoon}>
                <div style={styles.comingSoonIcon}>🚀</div>
                <h2 style={styles.comingSoonTitle}>Projects Coming Soon!</h2>
                <p style={styles.comingSoonDescription}>
                  Build real-world IoT devices with step-by-step project guides
                </p>

                <div style={styles.projectPreviewGrid}>
                  <div style={styles.projectPreview}>
                    <div style={styles.projectPreviewIcon}>🌱</div>
                    <h4 style={styles.projectPreviewTitle}>Smart Plant Monitor</h4>
                    <p style={styles.projectPreviewDesc}>Never forget to water again</p>
                  </div>
                  <div style={styles.projectPreview}>
                    <div style={styles.projectPreviewIcon}>🌡️</div>
                    <h4 style={styles.projectPreviewTitle}>Weather Station</h4>
                    <p style={styles.projectPreviewDesc}>Track temperature & humidity</p>
                  </div>
                  <div style={styles.projectPreview}>
                    <div style={styles.projectPreviewIcon}>🏠</div>
                    <h4 style={styles.projectPreviewTitle}>Home Automation</h4>
                    <p style={styles.projectPreviewDesc}>Control lights remotely</p>
                  </div>
                  <div style={styles.projectPreview}>
                    <div style={styles.projectPreviewIcon}>📱</div>
                    <h4 style={styles.projectPreviewTitle}>WiFi Notifications</h4>
                    <p style={styles.projectPreviewDesc}>Get alerts on your phone</p>
                  </div>
                </div>

                <div style={styles.projectFeatures}>
                  <div style={styles.featureItem}>
                    <span style={styles.featureIcon}>✓</span>
                    <span>Step-by-step instructions</span>
                  </div>
                  <div style={styles.featureItem}>
                    <span style={styles.featureIcon}>✓</span>
                    <span>3D printable enclosures</span>
                  </div>
                  <div style={styles.featureItem}>
                    <span style={styles.featureIcon}>✓</span>
                    <span>Complete parts list</span>
                  </div>
                  <div style={styles.featureItem}>
                    <span style={styles.featureIcon}>✓</span>
                    <span>Community showcase</span>
                  </div>
                </div>

                <div style={styles.unlockMessage}>
                  Complete your lessons to unlock projects!
                </div>
              </div>
            )}

            {activeTab === 'sandbox' && (
              <div style={styles.sandboxSection}>
                <h2 style={styles.sandboxTitle}>Creative Sandbox</h2>
                <p style={styles.sandboxDescription}>
                  Experiment freely without structured lessons. Write your own code and test ideas.
                </p>
                <button 
                  style={isConnected ? styles.sandboxButton : styles.sandboxButtonDisabled}
                  onClick={onOpenSandbox}
                  disabled={!isConnected}
                >
                  {isConnected ? 'Open Sandbox' : 'Connect Device First'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <AIAssistant
        lesson={{
          id: 'dashboard',
          title: 'Dashboard',
          board: 'pixie-m1',
          steps: []
        }}
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

const styles = {
  dashboard: {
    minHeight: '100vh',
    background: '#0a0a0a',
    padding: '2rem',
    fontFamily: 'DM Sans, -apple-system, BlinkMacSystemFont, sans-serif',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  logo: {
    height: '40px',
    width: 'auto',
  },
  studioText: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#fff',
  },
  stats: {
    display: 'flex',
    gap: '2rem',
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: '0.875rem',
    color: '#888',
    marginBottom: '0.25rem',
    fontFamily: 'DM Sans',
  },
  statValue: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#00d4aa',
    fontFamily: 'DM Sans',
  },
  progressBarContainer: {
    width: '100%',
    height: '6px',
    background: '#1a1a1a',
    borderRadius: '3px',
    overflow: 'hidden',
    marginBottom: '2rem',
  },
  progressBar: {
    height: '100%',
    background: 'linear-gradient(90deg, #00d4aa, #7c3aed)',
    transition: 'width 0.3s ease',
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  connectionCard: {
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '12px',
    padding: '1.5rem',
    marginBottom: '2rem',
  },
  sectionTitle: {
    fontSize: '1.25rem',
    marginBottom: '1rem',
    color: '#fff',
    fontFamily: 'DM Sans',
    fontWeight: 'bold',
  },
  compactConnection: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '2rem',
    alignItems: 'center',
  },
  boardSelector: {
    marginBottom: 0,
  },
  label: {
    display: 'block',
    color: '#aaa',
    marginBottom: '0.75rem',
    fontSize: '0.9rem',
    fontFamily: 'DM Sans',
  },
  boardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '0.75rem',
  },
  boardButton: {
    background: 'rgba(255, 255, 255, 0.03)',
    border: '2px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    padding: '0.75rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    position: 'relative',
    fontFamily: 'DM Sans',
  },
  boardButtonActive: {
    background: 'rgba(0, 212, 170, 0.1)',
    borderColor: '#00d4aa',
  },
  boardButtonDisabled: {
    opacity: 0.4,
    cursor: 'not-allowed',
  },
  boardName: {
    display: 'block',
    color: '#fff',
    fontWeight: '600',
    fontSize: '0.9rem',
    marginBottom: '0.25rem',
    fontFamily: 'DM Sans',
  },
  comingSoonBadge: {
    display: 'inline-block',
    background: '#333',
    color: '#888',
    padding: '0.2rem 0.4rem',
    borderRadius: '4px',
    fontSize: '0.7rem',
    fontFamily: 'DM Sans',
  },
  connectionStatus: {
    textAlign: 'center',
  },
  connectButton: {
    background: 'linear-gradient(135deg, #00d4aa, #7c3aed)',
    color: '#fff',
    border: 'none',
    padding: '0.875rem 1.75rem',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: 'DM Sans',
  },
  connectedBadge: {
    color: '#00d4aa',
    fontSize: '1rem',
    fontWeight: '600',
    fontFamily: 'DM Sans',
  },
  tabContainer: {
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  tabs: {
    display: 'flex',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    background: 'rgba(0, 0, 0, 0.2)',
  },
  tab: {
    flex: 1,
    background: 'none',
    border: 'none',
    color: '#888',
    padding: '1rem',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
    fontFamily: 'DM Sans',
    transition: 'all 0.2s',
  },
  tabActive: {
    flex: 1,
    background: 'rgba(0, 212, 170, 0.1)',
    border: 'none',
    borderBottom: '2px solid #00d4aa',
    color: '#00d4aa',
    padding: '1rem',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: 'DM Sans',
  },
  tabContent: {
    padding: '2rem',
  },
  unavailableBoard: {
    textAlign: 'center',
    padding: '4rem 2rem',
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '16px',
  },
  unavailableIcon: {
    fontSize: '4rem',
    marginBottom: '1rem',
  },
  unavailableTitle: {
    fontSize: '2rem',
    color: '#888',
    marginBottom: '1rem',
    fontFamily: 'DM Sans',
  },
  unavailableText: {
    fontSize: '1.125rem',
    color: '#aaa',
    marginBottom: '0.5rem',
    fontFamily: 'DM Sans',
  },
  unavailableSubtext: {
    fontSize: '1rem',
    color: '#00d4aa',
    fontFamily: 'DM Sans',
  },
  levelSection: {
    marginBottom: '3rem',
  },
  levelHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '0.75rem',
  },
  levelTitle: {
    fontSize: '1.75rem',
    color: '#00d4aa',
    fontWeight: 'bold',
    fontFamily: 'DM Sans',
    margin: 0,
  },
  levelBadge: {
    background: 'rgba(0, 212, 170, 0.15)',
    color: '#00d4aa',
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    fontSize: '0.875rem',
    fontWeight: '600',
    fontFamily: 'DM Sans',
  },
  levelDescription: {
    color: '#aaa',
    fontSize: '1rem',
    marginBottom: '1.5rem',
    fontFamily: 'DM Sans',
  },
  lessonCard: {
    background: 'linear-gradient(135deg, rgba(0, 212, 170, 0.08), rgba(124, 58, 237, 0.08))',
    border: '2px solid rgba(0, 212, 170, 0.2)',
    borderRadius: '12px',
    padding: '2rem',
    marginBottom: '2rem',
  },
  lessonHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem',
  },
  checkmark: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    background: '#00d4aa',
    color: '#000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  missingParts: {
    padding: '0.5rem 1rem',
    background: 'rgba(255, 0, 0, 0.1)',
    border: '1px solid rgba(255, 0, 0, 0.3)',
    borderRadius: '20px',
    color: '#ff6b6b',
    fontSize: '0.85rem',
    fontWeight: '600',
  },
  lessonBadge: {
    display: 'inline-block',
    background: '#00d4aa',
    color: '#000',
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: 'bold',
    marginBottom: '0.75rem',
    fontFamily: 'DM Sans',
  },
  lessonTitle: {
    fontSize: '1.75rem',
    marginBottom: '0.5rem',
    color: '#fff',
    fontFamily: 'DM Sans',
  },
  lessonDescription: {
    color: '#ccc',
    marginBottom: '1rem',
    lineHeight: '1.6',
    fontFamily: 'DM Sans',
  },
  lessonMeta: {
    display: 'flex',
    gap: '1.5rem',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
  },
  metaItem: {
    color: '#aaa',
    fontSize: '0.9rem',
    fontFamily: 'DM Sans',
  },
  startButton: {
    background: 'linear-gradient(135deg, #00d4aa, #7c3aed)',
    color: '#fff',
    border: 'none',
    padding: '1rem 2rem',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: 'DM Sans',
  },
  startButtonDisabled: {
    background: '#333',
    color: '#666',
    border: 'none',
    padding: '1rem 2rem',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'not-allowed',
    fontFamily: 'DM Sans',
  },
  comingSoon: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1rem',
  },
  lockedLesson: {
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '12px',
    padding: '1.5rem',
    textAlign: 'center',
    opacity: 0.5,
  },
  lockIcon: {
    fontSize: '2rem',
    marginBottom: '0.5rem',
  },
  lockedTitle: {
    fontSize: '1.125rem',
    marginBottom: '0.25rem',
    color: '#fff',
    fontFamily: 'DM Sans',
  },
  lockedText: {
    color: '#888',
    fontSize: '0.875rem',
    margin: 0,
    fontFamily: 'DM Sans',
  },
  moduleDescription: {
    color: '#aaa',
    marginBottom: '1.5rem',
    fontSize: '0.95rem',
    fontFamily: 'DM Sans',
  },
  categorySection: {
    marginBottom: '3rem',
  },
  categoryTitle: {
    fontSize: '1.25rem',
    color: '#00d4aa',
    marginBottom: '1rem',
    fontWeight: '600',
    fontFamily: 'DM Sans',
    paddingBottom: '0.5rem',
    borderBottom: '2px solid rgba(0, 212, 170, 0.2)',
  },
  moduleGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '1rem',
  },
  moduleCard: {
    background: 'rgba(255, 255, 255, 0.03)',
    border: '2px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    padding: '1.5rem',
    transition: 'all 0.2s',
    position: 'relative',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
  },
  moduleClickArea: {
    cursor: 'pointer',
    flex: 1,
  },
  moduleCardOwned: {
    background: 'rgba(0, 212, 170, 0.08)',
    borderColor: '#00d4aa',
  },
  moduleCheckbox: {
    position: 'absolute',
    top: '0.75rem',
    right: '0.75rem',
    width: '24px',
    height: '24px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(0, 0, 0, 0.3)',
  },
  checkIcon: {
    color: '#00d4aa',
    fontSize: '1rem',
    fontWeight: 'bold',
  },
  moduleImageContainer: {
    width: '100%',
    height: '120px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1rem',
    background: 'rgba(255, 255, 255, 0.02)',
    borderRadius: '8px',
  },
  moduleImage: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
  },
  moduleName: {
    fontSize: '1rem',
    color: '#fff',
    marginBottom: '0.5rem',
    fontFamily: 'DM Sans',
    fontWeight: '600',
  },
  moduleDesc: {
    color: '#888',
    fontSize: '0.85rem',
    marginBottom: '0.75rem',
    fontFamily: 'DM Sans',
  },
  requiredFor: {
    fontSize: '0.75rem',
    color: '#00d4aa',
    fontFamily: 'DM Sans',
  },
  purchaseLink: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    marginTop: '1rem',
    padding: '0.5rem',
    background: 'rgba(0, 212, 170, 0.1)',
    border: '1px solid rgba(0, 212, 170, 0.3)',
    borderRadius: '6px',
    color: '#00d4aa',
    textDecoration: 'none',
    fontSize: '0.85rem',
    fontWeight: '500',
    fontFamily: 'DM Sans',
    transition: 'all 0.2s',
  },
  infoIcon: {
    fontSize: '1rem',
    fontWeight: 'bold',
  },
  sandboxSection: {
    textAlign: 'center',
    padding: '2rem',
  },
  sandboxTitle: {
    fontSize: '2rem',
    marginBottom: '1rem',
    color: '#fff',
    fontFamily: 'DM Sans',
  },
  sandboxDescription: {
    color: '#aaa',
    marginBottom: '2rem',
    fontSize: '1rem',
    lineHeight: '1.6',
    fontFamily: 'DM Sans',
  },
  sandboxButton: {
    background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
    color: '#fff',
    border: 'none',
    padding: '1rem 2rem',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: 'DM Sans',
  },
  sandboxButtonDisabled: {
    background: '#333',
    color: '#666',
    border: 'none',
    padding: '1rem 2rem',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'not-allowed',
    fontFamily: 'DM Sans',
  },
  projectsComingSoon: {
    textAlign: 'center',
    padding: '3rem 2rem',
  },
  comingSoonIcon: {
    fontSize: '4rem',
    marginBottom: '1rem',
  },
  comingSoonTitle: {
    fontSize: '2.5rem',
    color: '#fff',
    marginBottom: '1rem',
    fontFamily: 'DM Sans',
    fontWeight: 'bold',
  },
  comingSoonDescription: {
    fontSize: '1.25rem',
    color: '#aaa',
    marginBottom: '3rem',
    fontFamily: 'DM Sans',
  },
  projectPreviewGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.5rem',
    marginBottom: '3rem',
    maxWidth: '900px',
    margin: '0 auto 3rem auto',
  },
  projectPreview: {
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '12px',
    padding: '2rem 1.5rem',
    transition: 'all 0.3s ease',
  },
  projectPreviewIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
  projectPreviewTitle: {
    fontSize: '1.125rem',
    color: '#fff',
    marginBottom: '0.5rem',
    fontFamily: 'DM Sans',
    fontWeight: '600',
  },
  projectPreviewDesc: {
    fontSize: '0.875rem',
    color: '#888',
    fontFamily: 'DM Sans',
    margin: 0,
  },
  projectFeatures: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    maxWidth: '800px',
    margin: '0 auto 2rem auto',
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    color: '#ccc',
    fontSize: '1rem',
    fontFamily: 'DM Sans',
  },
  featureIcon: {
    color: '#00d4aa',
    fontSize: '1.25rem',
    fontWeight: 'bold',
  },
  unlockMessage: {
    fontSize: '1.125rem',
    color: '#00d4aa',
    fontWeight: '600',
    marginTop: '2rem',
    padding: '1rem',
    background: 'rgba(0, 212, 170, 0.1)',
    border: '1px solid rgba(0, 212, 170, 0.3)',
    borderRadius: '8px',
    display: 'inline-block',
    fontFamily: 'DM Sans',
  },
};