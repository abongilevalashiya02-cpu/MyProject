import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const FundingPage = () => {
  const allocationChartRef = useRef<HTMLCanvasElement>(null);
  const techSpendChartRef = useRef<HTMLCanvasElement>(null);
  const gtmSpendChartRef = useRef<HTMLCanvasElement>(null);
  
  // Store chart instances for proper cleanup
  const allocationChartInstance = useRef<Chart | null>(null);
  const techChartInstance = useRef<Chart | null>(null);
  const gtmChartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    // Helper function to wrap labels
    const wrapLabel = (str: string, maxWidth: number) => {
      if (str.length <= maxWidth) {
        return str;
      }
      const words = str.split(' ');
      const lines: string[] = [];
      let currentLine = '';
      words.forEach(word => {
        if ((currentLine + word).length > maxWidth) {
          lines.push(currentLine.trim());
          currentLine = '';
        }
        currentLine += word + ' ';
      });
      lines.push(currentLine.trim());
      return lines;
    };

    const tooltipTitleCallback = (tooltipItems: any[]) => {
      const item = tooltipItems[0];
      let label = item.chart.data.labels[item.dataIndex];
      if (Array.isArray(label)) {
        return label.join(' ');
      }
      return label;
    };

    const sharedChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom' as const,
          labels: {
            font: {
              family: 'Inter',
              size: 12,
            },
            color: '#004D40',
          }
        },
        tooltip: {
          callbacks: {
            title: tooltipTitleCallback
          },
          backgroundColor: '#004D40',
          titleFont: { family: 'Inter', weight: 'bold' as const, size: 14 },
          bodyFont: { family: 'Inter', size: 12 },
        }
      }
    };

    // Destroy existing charts before creating new ones
    if (allocationChartInstance.current) {
      allocationChartInstance.current.destroy();
    }
    if (techChartInstance.current) {
      techChartInstance.current.destroy();
    }
    if (gtmChartInstance.current) {
      gtmChartInstance.current.destroy();
    }

    // Allocation Chart
    if (allocationChartRef.current) {
      const allocationCtx = allocationChartRef.current.getContext('2d');
      if (allocationCtx) {
        allocationChartInstance.current = new Chart(allocationCtx, {
          type: 'doughnut',
          data: {
            labels: ['Go-to-Market & Human Capital', 'Technology & Product', 'Operations & Admin'],
            datasets: [{
              label: 'Budget Allocation',
              data: [148800, 44200, 7000],
              backgroundColor: ['#00796B', '#00CECB', '#FF5E5B'],
              borderColor: '#FFFFEA',
              borderWidth: 4,
              hoverOffset: 8
            }]
          },
          options: { ...sharedChartOptions }
        });
      }
    }

    // Tech Spend Chart
    if (techSpendChartRef.current) {
      const techCtx = techSpendChartRef.current.getContext('2d');
      if (techCtx) {
        techChartInstance.current = new Chart(techCtx, {
          type: 'bar',
          data: {
            labels: [
              wrapLabel('Data Scientist (New Hire)', 18),
              wrapLabel('Contract UI/UX Designer', 18),
              wrapLabel('Delsa Marasha (Growth Engineer)', 18),
              wrapLabel('Platform Infrastructure & APIs', 18)
            ],
            datasets: [{
              label: 'Allocation ($)',
              data: [19200, 10000, 10200, 4800],
              backgroundColor: ['#00796B', '#009688', '#00CECB', '#4DB6AC'],
              borderColor: '#004D40',
              borderWidth: 1,
              borderRadius: 4
            }]
          },
          options: {
            ...sharedChartOptions,
            indexAxis: 'y' as const,
            scales: {
              x: {
                ticks: {
                  callback: function(value: any) {
                    return '$' + (value/1000) + 'k';
                  },
                  color: '#004D40',
                },
                grid: {
                  display: false
                }
              },
              y: {
                ticks: {
                  font: { family: 'Inter', size: 10 },
                  color: '#004D40',
                },
                grid: {
                  display: false
                }
              }
            },
            plugins: {
              ...sharedChartOptions.plugins,
              legend: { display: false }
            }
          }
        });
      }
    }

    // GTM Spend Chart
    if (gtmSpendChartRef.current) {
      const gtmCtx = gtmSpendChartRef.current.getContext('2d');
      if (gtmCtx) {
        gtmChartInstance.current = new Chart(gtmCtx, {
          type: 'bar',
          data: {
            labels: ['GTM & Human Capital Spend'],
            datasets: [
              {
                label: 'Team Salaries',
                data: [98400],
                backgroundColor: '#00796B',
                stack: 'A',
                borderRadius: 4
              },
              {
                label: 'Direct GTM Spend (Campaigns, etc.)',
                data: [30400],
                backgroundColor: '#FF5E5B',
                stack: 'A',
                borderRadius: 4
              }
            ]
          },
          options: {
            ...sharedChartOptions,
            indexAxis: 'y' as const,
            scales: {
              x: {
                stacked: true,
                ticks: {
                  callback: function(value: any) {
                    return '$' + (value/1000) + 'k';
                  },
                  color: '#004D40',
                },
                grid: {
                  display: false
                }
              },
              y: {
                stacked: true,
                ticks: {
                  display: false
                },
                grid: {
                  display: false
                }
              }
            },
          }
        });
      }
    }

    // Cleanup function to destroy charts when component unmounts
    return () => {
      if (allocationChartInstance.current) {
        allocationChartInstance.current.destroy();
      }
      if (techChartInstance.current) {
        techChartInstance.current.destroy();
      }
      if (gtmChartInstance.current) {
        gtmChartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <div style={{ backgroundColor: '#FFFFEA', fontFamily: 'Inter, sans-serif', color: '#004D40' }}>
      <div className="container mx-auto p-4 md:p-8 max-w-7xl">
        <header className="text-center my-12">
          <h1 className="text-4xl md:text-6xl font-black" style={{ color: '#00796B' }}>BANTU STALL</h1>
          <p className="text-xl md:text-2xl font-semibold mt-2">Fueling the Future of Cultural Travel</p>
          <p className="mt-4 max-w-3xl mx-auto text-lg">
            This is the strategic rationale for our{' '}
            <span className="font-bold px-2 py-1 rounded" style={{ backgroundColor: '#FFED66' }}>
              $200,000 Pre-Seed
            </span>{' '}
            investment, designed to transform a proven service into a scalable technology platform.
          </p>
        </header>

        <section id="opportunity" className="mb-16">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <h2 className="text-3xl font-bold text-center mb-6">From Proven Service to Scalable Platform</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="border-b-4 pb-4" style={{ borderColor: '#FF5E5B' }}>
                <p className="text-5xl font-extrabold" style={{ color: '#FF5E5B' }}>$800K+</p>
                <p className="mt-2 text-lg font-semibold">Revenue Generated</p>
                <p className="text-sm">From 10+ manually curated group trips in a 18 month period.</p>
              </div>
              <div className="border-b-4 pb-4" style={{ borderColor: '#00CECB' }}>
                <p className="text-5xl font-extrabold" style={{ color: '#00CECB' }}>200+</p>
                <p className="mt-2 text-lg font-semibold">Travelers Hosted</p>
                <p className="text-sm">Validating high-value market demand.</p>
              </div>
              <div className="border-b-4 pb-4" style={{ borderColor: '#00796B' }}>
                <p className="text-5xl font-extrabold" style={{ color: '#00796B' }}>The Challenge</p>
                <p className="mt-2 text-lg font-semibold">Manual Scaling Limits</p>
                <p className="text-sm">Our current model is unscalable. This investment builds the engine for growth.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="allocation" className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-2">Strategic Capital Allocation: $200,000</h2>
          <p className="text-center max-w-3xl mx-auto mb-8">
            A disciplined budget focused on building the product, igniting the marketplace, and creating a stable operational foundation.
          </p>
          <div className="bg-white rounded-lg shadow-xl p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="h-80 md:h-96 relative">
              <canvas ref={allocationChartRef}></canvas>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4">Investment Breakdown</h3>
              <p className="mb-6">
                Our allocation prioritizes human capital and go-to-market execution, reflecting our strategy to build a dedicated team from day one to drive traction and product development.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: '#00796B' }}></div>
                  <div>
                    <span className="font-bold">74.4% GTM & Human Capital ($148,800):</span>
                    <span className="text-sm block">Building the team and acquiring our first customers & hosts.</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: '#00CECB' }}></div>
                  <div>
                    <span className="font-bold">22.1% Technology & Product ($44,200):</span>
                    <span className="text-sm block">Developing the core Musika marketplace MVP.</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: '#FF5E5B' }}></div>
                  <div>
                    <span className="font-bold">3.5% Operations & Admin ($7,000):</span>
                    <span className="text-sm block">Ensuring a stable and legally compliant foundation.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-16 mb-16">
          <section id="technology">
            <h2 className="text-3xl font-bold text-center mb-2">Building the Engine: Technology</h2>
            <p className="text-center max-w-2xl mx-auto mb-8">
              A lean, focused approach to build our transactional core: the <strong>Musika Marketplace MVP</strong>.
            </p>
            <div className="bg-white rounded-lg shadow-xl p-8">
              <h3 className="text-xl font-bold mb-4 text-center">Tech Budget Focus: $44,200</h3>
              <div className="h-64 md:h-80 relative">
                <canvas ref={techSpendChartRef}></canvas>
              </div>
              <p className="text-sm mt-4 text-center">
                This budget secures a lean in-house team and essential design resources to build a trustworthy product.
              </p>
              <hr className="my-6 border-gray-200" />
              <h3 className="text-xl font-bold mb-4 text-center">MVP Core Transactional Loop</h3>
              <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4">
                <div className="text-center p-4 rounded-lg" style={{ backgroundColor: 'rgba(0, 206, 203, 0.1)' }}>
                  <p className="font-bold" style={{ color: '#00796B' }}>1. Discover</p>
                  <p className="text-sm">User finds authentic experiences.</p>
                </div>
                <div className="text-2xl font-bold transform rotate-90 md:rotate-0" style={{ color: '#00796B' }}>→</div>
                <div className="text-center p-4 rounded-lg" style={{ backgroundColor: 'rgba(0, 206, 203, 0.1)' }}>
                  <p className="font-bold" style={{ color: '#00796B' }}>2. Book & Pay</p>
                  <p className="text-sm">Secure transaction via platform.</p>
                </div>
                <div className="text-2xl font-bold transform rotate-90 md:rotate-0" style={{ color: '#00796B' }}>→</div>
                <div className="text-center p-4 rounded-lg" style={{ backgroundColor: 'rgba(0, 206, 203, 0.1)' }}>
                  <p className="font-bold" style={{ color: '#00796B' }}>3. Experience</p>
                  <p className="text-sm">Connect with local "gigpreneurs".</p>
                </div>
              </div>
            </div>
          </section>
          
          <section id="gtm">
            <h2 className="text-3xl font-bold text-center mb-2">Igniting the Marketplace: GTM</h2>
            <p className="text-center max-w-2xl mx-auto mb-8">
              Solving the "cold start" problem by investing in our team and a capital-efficient B2B-first strategy.
            </p>
            <div className="bg-white rounded-lg shadow-xl p-8">
              <h3 className="text-xl font-bold mb-4 text-center">GTM & Human Capital: $148,800</h3>
              <div className="h-64 md:h-80 relative">
                <canvas ref={gtmSpendChartRef}></canvas>
              </div>
              <p className="text-sm mt-4 text-center">
                The majority of our investment is in people—the core team that will drive growth and customer success.
              </p>
              <hr className="my-6 border-gray-200" />
              <h3 className="text-xl font-bold mb-4 text-center">B2B-First Flywheel</h3>
              <p className="text-center">
                High-value corporate deals are our primary target. Each B2B sale brings a cohort of new professionals to our platform at near-zero acquisition cost, kickstarting the B2C ecosystem.
              </p>
            </div>
          </section>
        </div>

        <section id="kpis" className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-2">Our Pre-Seed Scorecard</h2>
          <p className="text-center max-w-3xl mx-auto mb-8">
            These are the key performance indicators we will achieve over the next 12-18 months to validate our model and prepare for our Seed round.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-xl p-6 text-center border-t-4" style={{ borderColor: '#FF5E5B' }}>
              <p className="text-4xl font-extrabold" style={{ color: '#00796B' }}>100+</p>
              <p className="font-bold mt-2">Verified Hosts Onboarded</p>
              <p className="text-sm mt-1">Activating our existing database of suppliers.</p>
            </div>
            <div className="bg-white rounded-lg shadow-xl p-6 text-center border-t-4" style={{ borderColor: '#00CECB' }}>
              <p className="text-4xl font-extrabold" style={{ color: '#00796B' }}>1,000+</p>
              <p className="font-bold mt-2">Registered Users</p>
              <p className="text-sm mt-1">Acquired primarily via the B2B-to-B2C flywheel.</p>
            </div>
            <div className="bg-white rounded-lg shadow-xl p-6 text-center border-t-4" style={{ borderColor: '#00796B' }}>
              <p className="text-4xl font-extrabold" style={{ color: '#00796B' }}>$100K</p>
              <p className="font-bold mt-2">Gross Merchandise Volume</p>
              <p className="text-sm mt-1">Driven by 3-5 high-value corporate deals.</p>
            </div>
            <div className="bg-white rounded-lg shadow-xl p-6 text-center border-t-4" style={{ borderColor: '#FFED66' }}>
              <p className="text-4xl font-extrabold" style={{ color: '#00796B' }}>LAUNCH</p>
              <p className="font-bold mt-2">Musika MVP</p>
              <p className="text-sm mt-1">A fully transactional platform live within 3 months.</p>
            </div>
          </div>
        </section>

        <footer className="text-center mt-16 py-8 border-t-2" style={{ borderColor: 'rgba(0, 121, 107, 0.2)' }}>
          <p className="text-2xl font-bold" style={{ color: '#00796B' }}>
            The Vision: Building Africa's Definitive Cultural Travel Infrastructure.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default FundingPage;