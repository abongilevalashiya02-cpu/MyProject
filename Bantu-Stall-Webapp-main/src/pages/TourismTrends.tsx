
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  ChartBar, 
  TrendingUp, 
  Globe, 
  Plane, 
  Leaf, 
  History, 
  Hotel, 
  Briefcase,
  Search,
  Filter,
  BookOpen,
  ArrowRight,
  Target,
  Users,
  Calendar,
  MapPin
} from 'lucide-react';

const TourismTrends = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedTrends, setExpandedTrends] = useState<Set<number>>(new Set());

  const toggleTrendExpansion = (trendId: number) => {
    const newExpanded = new Set(expandedTrends);
    if (newExpanded.has(trendId)) {
      newExpanded.delete(trendId);
    } else {
      newExpanded.add(trendId);
    }
    setExpandedTrends(newExpanded);
  };

  const trends = [
    {
      id: 1,
      icon: TrendingUp,
      title: "Africa's Tourism Rebound: Record-Breaking Growth",
      category: "Growth",
      date: "2024",
      readTime: "3 min read",
      summary: "74 million international tourists visited Africa in 2024, marking unprecedented recovery.",
      content: [
        "74 million international tourists visited Africa in 2024, marking a 7% increase over 2019 and a 12% rise from 2023. This positions Africa as the second-fastest recovering tourism region globally, following the Middle East.",
        "North Africa led the recovery, with international arrivals rising 22% compared to 2019."
      ],
      detailedContent: [
        "Sub-Saharan Africa also showed remarkable resilience with a 15% increase in international arrivals, driven primarily by South Africa, Kenya, and Tanzania. The region's diverse offerings from wildlife safaris to cultural experiences have attracted a new generation of travelers.",
        "Key growth drivers include improved infrastructure, new airline routes, and enhanced digital marketing efforts by national tourism boards. The implementation of single visa initiatives across several African countries has also simplified travel for tourists.",
        "The economic impact has been substantial, with tourism contributing over $120 billion to African economies in 2024, supporting approximately 24 million jobs across the continent. This represents a significant recovery from the pandemic lows of 2020-2021.",
        "Looking ahead to 2025, industry experts predict continued growth of 8-10%, positioning Africa as one of the fastest-growing tourism regions globally. Investment in sustainable tourism infrastructure remains a priority to support this growth while preserving natural heritage."
      ],
      stats: [
        { label: "Tourist Arrivals", value: "74M", change: "+12%" },
        { label: "Growth vs 2019", value: "7%", change: "positive" },
        { label: "Regional Ranking", value: "#2", change: "stable" }
      ],
      color: "from-emerald-500 to-teal-600"
    },
    {
      id: 2,
      icon: Leaf,
      title: "Sustainable and Eco-Tourism on the Rise",
      category: "Sustainability",
      date: "2024",
      readTime: "4 min read",
      summary: "Kenya and Tanzania lead sustainable safari experiences as eco-tourism becomes top priority.",
      content: [
        "Kenya and Tanzania are leading in sustainable safari experiences, spotlighting eco-tourism as a top travel focus in 2025.",
        "Community-based tourism and conservation-focused trips are expected to grow, with lodges and resorts adopting green practices to attract eco-conscious travelers."
      ],
      detailedContent: [
        "The shift towards sustainable tourism is being driven by increased environmental awareness among travelers, with 85% of global tourists indicating they want to stay in eco-friendly accommodations. Kenya's Maasai Mara and Tanzania's Serengeti have implemented groundbreaking conservation programs that directly involve local communities.",
        "Major hotel chains are investing heavily in green technologies, with properties achieving LEED certification and implementing solar power, water recycling systems, and waste reduction programs. These initiatives have reduced operational costs by 30% while attracting premium-paying eco-conscious guests.",
        "Community-based tourism initiatives have created over 50,000 new jobs across East Africa, with local communities receiving direct revenue from conservation efforts. This model has proven so successful that it's being replicated across other African nations including Botswana, Namibia, and Rwanda."
      ],
      stats: [
        { label: "Eco-Conscious Travelers", value: "65%", change: "+18%" },
        { label: "Green Certified Lodges", value: "240+", change: "+32%" },
        { label: "Conservation Impact", value: "85%", change: "positive" }
      ],
      color: "from-green-500 to-emerald-600"
    },
    {
      id: 3,
      icon: History,
      title: "Heritage and Ancestry Travel: A Deepening Connection",
      category: "Heritage",
      date: "2024",
      readTime: "5 min read",
      summary: "75% of South Africans have taken or plan heritage holidays exploring family history.",
      content: [
        "75% of South Africans have taken or plan to take a heritage holiday, exploring their family's history and ancestry.",
        "This trend is particularly strong among younger generations, with 88% of 25–34-year-olds expressing interest in heritage travel."
      ],
      detailedContent: [
        "Heritage tourism has become a powerful driver of cultural preservation and economic development across Africa. Ghana's 'Year of Return' initiative in 2019 has evolved into a permanent program, attracting thousands of diaspora visitors annually who contribute significantly to local economies.",
        "South Africa's heritage sites including Robben Island, Cradle of Humankind, and various cultural villages have seen unprecedented growth in bookings. The integration of technology through AR experiences and digital storytelling has enhanced visitor engagement with historical narratives.",
        "Educational institutions are partnering with tourism boards to develop heritage trails and cultural immersion programs. These initiatives not only preserve traditional knowledge but also create sustainable income for local communities through storytelling, craft demonstrations, and cultural performances."
      ],
      stats: [
        { label: "Heritage Travelers", value: "75%", change: "+25%" },
        { label: "Young Adults (25-34)", value: "88%", change: "+15%" },
        { label: "Cultural Sites Visited", value: "156", change: "+28%" }
      ],
      color: "from-amber-500 to-orange-600"
    },
    {
      id: 4,
      icon: Plane,
      title: "Improved Air Connectivity: Easier Access to Africa",
      category: "Connectivity",
      date: "2025",
      readTime: "3 min read",
      summary: "New direct flights enhance access to African destinations with major airline expansions.",
      content: [
        "New direct flights are enhancing access to African destinations:",
        "• United Airlines will begin thrice-weekly service from Washington D.C. to Dakar, Senegal, on May 23, 2025.",
        "• Delta adds a direct flight from Atlanta to Accra, Ghana, starting December 1, 2025.",
        "• Air France will launch flights from Paris to Kilimanjaro, Tanzania."
      ],
      detailedContent: [
        "The expansion of direct flight routes represents a $2.8 billion investment in African aviation infrastructure over the next three years. Major airlines are recognizing Africa's potential, with passenger traffic projected to grow by 4.8% annually through 2027.",
        "Beyond new routes, existing airlines are increasing frequency and capacity. Ethiopian Airlines has added 15 new destinations, while Kenya Airways has expanded its European connections. These improvements have reduced average journey times by 35% and increased seat availability by 45%.",
        "The African Continental Free Trade Area (AfCFTA) has accelerated regional connectivity, with intra-African flights increasing by 28% in 2024. New hub strategies in Addis Ababa, Nairobi, and Lagos are positioning Africa as a global transit destination.",
        "Investment in airport infrastructure has been equally impressive, with $1.2 billion allocated to terminal expansions and runway improvements across 12 African countries. Digital infrastructure upgrades are enhancing passenger experience with biometric processing and smart baggage systems."
      ],
      stats: [
        { label: "New Routes", value: "12", change: "+200%" },
        { label: "Flight Capacity", value: "+45%", change: "positive" },
        { label: "Travel Time Reduction", value: "35%", change: "improved" }
      ],
      color: "from-blue-500 to-indigo-600"
    },
    {
      id: 5,
      icon: Globe,
      title: "Wellness, Adventure, and Slow Travel Experiences",
      category: "Experience",
      date: "2024",
      readTime: "4 min read",
      summary: "Wellness retreats and slow travel experiences attract adventurous tourists seeking deeper connections.",
      content: [
        "Wellness retreats in Mauritius and offbeat gems like Rwanda and Botswana are attracting adventurous travelers seeking unique experiences.",
        "The trend toward 'slow travel' sees tourists spending longer periods in fewer destinations to form deeper connections with local cultures and communities."
      ],
      detailedContent: [
        "The wellness tourism market in Africa has grown exponentially, with destinations like Mauritius leading with luxury spa resorts and meditation retreats. Rwanda's eco-lodges and Botswana's wilderness experiences are attracting travelers seeking mental restoration through nature immersion.",
        "Slow travel has redefined the African tourism experience, with visitors now staying an average of 14 days per destination compared to 7 days in previous years. This trend has led to deeper cultural exchanges and higher per-visitor spending, benefiting local communities significantly.",
        "Adventure tourism has evolved beyond traditional safaris to include gorilla trekking in Uganda, hiking in the Atlas Mountains, and diving in Mozambique. These experiences are designed to provide transformative journeys that combine physical challenge with cultural learning."
      ],
      stats: [
        { label: "Wellness Bookings", value: "+78%", change: "positive" },
        { label: "Avg. Stay Duration", value: "14 days", change: "+40%" },
        { label: "Repeat Visitors", value: "62%", change: "+23%" }
      ],
      color: "from-purple-500 to-pink-600"
    },
    {
      id: 6,
      icon: Hotel,
      title: "Luxury Travel with Cultural Enrichment",
      category: "Luxury",
      date: "2024",
      readTime: "3 min read",
      summary: "South Africa sees 5.1% increase in luxury travel combining comfort with cultural immersion.",
      content: [
        "South Africa welcomed 8.92 million international arrivals in 2024, a 5.1% increase from the previous year, indicating a resurgence in luxury travel experiences that combine comfort with cultural immersion.",
        "Tourists are gravitating toward accommodations that provide five-star comforts while reflecting the country's unique culture and history."
      ],
      detailedContent: [
        "The luxury travel segment has shown remarkable resilience, with high-end safari lodges and boutique hotels reporting occupancy rates of 92% throughout 2024. Destinations like the Sabi Sands Game Reserve and Cape Winelands have become synonymous with ultra-luxury African experiences.",
        "Cultural immersion programs have become integral to luxury offerings, with guests participating in cooking classes with local chefs, traditional craft workshops, and exclusive access to historical sites. These experiences command premium pricing while supporting local artisans and cultural preservation.",
        "The integration of technology in luxury hospitality has enhanced guest experiences, with AI-powered personalization, virtual concierge services, and sustainable luxury practices becoming standard. Solar-powered luxury lodges and carbon-neutral safari experiences are attracting environmentally conscious affluent travelers."
      ],
      stats: [
        { label: "Luxury Arrivals", value: "8.92M", change: "+5.1%" },
        { label: "Cultural Experiences", value: "92%", change: "+18%" },
        { label: "Premium Spending", value: "+34%", change: "positive" }
      ],
      color: "from-rose-500 to-red-600"
    },
    {
      id: 7,
      icon: Briefcase,
      title: "Digital Nomad Tourism: Africa as a Remote Work Haven",
      category: "Remote Work",
      date: "2024",
      readTime: "4 min read",
      summary: "African destinations emerge as hotspots for digital nomads seeking affordable, exotic locations.",
      content: [
        "The global rise of remote work is fueling a new wave of digital nomads seeking affordable, exotic locations. African destinations such as Cape Town, Zanzibar, and Kigali are emerging as hotspots due to their affordability, connectivity, and vibrant cultures."
      ],
      detailedContent: [
        "Cape Town has established itself as Africa's digital nomad capital, with over 15,000 remote workers calling it home in 2024. The city's combination of world-class infrastructure, affordable living costs, and stunning natural beauty makes it an irresistible destination for location-independent professionals.",
        "Zanzibar and Kigali are emerging as next-generation nomad hubs, offering unique advantages including visa-friendly policies, growing co-working ecosystems, and strong internet connectivity. Rwanda's commitment to digital transformation has made Kigali a tech-forward destination with reliable 5G coverage and numerous innovation hubs.",
        "The economic impact of digital nomad tourism is substantial, with remote workers spending an average of $2,800 per month in African destinations compared to $1,200 for traditional tourists. This higher spending power is driving investment in nomad-specific infrastructure including co-living spaces, networking events, and digital services."
      ],
      stats: [
        { label: "Digital Nomads", value: "+156%", change: "positive" },
        { label: "Co-working Spaces", value: "89", change: "+67%" },
        { label: "Internet Speed Avg", value: "85 Mbps", change: "+120%" }
      ],
      color: "from-cyan-500 to-blue-600"
    }
  ];

  const categories = [
    { id: 'all', label: 'All Trends', count: trends.length },
    { id: 'Growth', label: 'Growth', count: trends.filter(t => t.category === 'Growth').length },
    { id: 'Sustainability', label: 'Sustainability', count: trends.filter(t => t.category === 'Sustainability').length },
    { id: 'Heritage', label: 'Heritage', count: trends.filter(t => t.category === 'Heritage').length },
    { id: 'Experience', label: 'Experience', count: trends.filter(t => t.category === 'Experience').length },
  ];

  const filteredTrends = trends.filter(trend => {
    const matchesSearch = trend.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         trend.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || trend.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.6
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20">
        {/* Hero Section */}
        <motion.section 
          className="relative bg-gradient-to-br from-primary via-primary-foreground to-secondary text-white py-20 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0 bg-black/20" />
          <div className="container mx-auto px-6 relative z-10">
            <motion.div 
              className="max-w-4xl mx-auto text-center"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div 
                className="flex items-center justify-center gap-3 mb-6"
                variants={itemVariants}
              >
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-full">
                  <ChartBar className="h-8 w-8 text-white" />
                </div>
                <Badge variant="secondary" className="px-4 py-2 text-lg font-medium">
                  Industry Insights
                </Badge>
              </motion.div>
              
              <motion.h1 
                className="text-5xl lg:text-6xl font-bold mb-6 leading-tight"
                variants={itemVariants}
              >
                Tourism Industry
                <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  Trends & Reports
                </span>
              </motion.h1>
              
              <motion.p 
                className="text-xl lg:text-2xl text-white/90 mb-8 leading-relaxed"
                variants={itemVariants}
              >
                Stay ahead with comprehensive insights into Africa's tourism landscape, 
                emerging trends, and market opportunities.
              </motion.p>

              <motion.div 
                className="flex flex-wrap items-center justify-center gap-6 text-white/80"
                variants={itemVariants}
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  <span>{trends.length} Reports</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  <span>7 Key Trends</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span>74M+ Tourists</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* Search and Filter Section */}
        <motion.section 
          className="py-12 bg-muted/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col lg:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Search trends and reports..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 py-3 text-lg border-2 focus:border-primary"
                  />
                </div>
                <Button variant="outline" size="lg" className="lg:px-8">
                  <Filter className="h-5 w-5 mr-2" />
                  Advanced Filters
                </Button>
              </div>

              <div className="flex flex-wrap gap-3">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className="transition-all duration-200"
                  >
                    {category.label}
                    <Badge variant="secondary" className="ml-2">
                      {category.count}
                    </Badge>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Trends Grid */}
        <motion.section 
          className="py-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="container mx-auto px-6">
            <div className="grid gap-8 lg:gap-12 max-w-6xl mx-auto">
              {filteredTrends.map((trend, index) => (
                <motion.div
                  key={trend.id}
                  variants={itemVariants}
                  className="group"
                >
                  <Card className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                    <div className={`h-2 bg-gradient-to-r ${trend.color}`} />
                    
                    <CardHeader className="pb-4">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-4">
                            <div className={`p-3 rounded-full bg-gradient-to-r ${trend.color}`}>
                              <trend.icon className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge variant="outline">{trend.category}</Badge>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                {trend.date}
                              </div>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <BookOpen className="h-4 w-4" />
                                {trend.readTime}
                              </div>
                            </div>
                          </div>
                          
                          <CardTitle className="text-2xl lg:text-3xl font-bold leading-tight mb-3 group-hover:text-primary transition-colors">
                            {trend.title}
                          </CardTitle>
                          
                          <p className="text-lg text-muted-foreground leading-relaxed">
                            {trend.summary}
                          </p>
                        </div>

                        <div className="lg:w-80">
                          <div className="grid grid-cols-3 gap-3">
                            {trend.stats.map((stat, statIndex) => (
                              <div key={statIndex} className="text-center p-3 bg-muted/50 rounded-lg">
                                <div className="text-2xl font-bold text-primary mb-1">
                                  {stat.value}
                                </div>
                                <div className="text-xs text-muted-foreground leading-tight">
                                  {stat.label}
                                </div>
                                {stat.change && (
                                  <div className="text-xs text-green-600 font-medium mt-1">
                                    {stat.change}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="space-y-4 mb-6">
                        {trend.content.map((paragraph, pIndex) => (
                          <p key={pIndex} className="text-base leading-relaxed text-foreground/90">
                            {paragraph}
                          </p>
                        ))}
                        
                        {/* Expanded content */}
                        {expandedTrends.has(trend.id) && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-4 pt-4 border-t border-muted"
                          >
                            <div className="flex items-center gap-2 mb-3">
                              <BookOpen className="h-5 w-5 text-primary" />
                              <h4 className="text-lg font-semibold text-primary">Full Report Details</h4>
                            </div>
                            {trend.detailedContent.map((paragraph, pIndex) => (
                              <p key={pIndex} className="text-base leading-relaxed text-foreground/80">
                                {paragraph}
                              </p>
                            ))}
                          </motion.div>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>Africa & Global Markets</span>
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="group/btn"
                          onClick={() => toggleTrendExpansion(trend.id)}
                        >
                          {expandedTrends.has(trend.id) ? 'Show Less' : 'Read Full Report'}
                          <ArrowRight className={`h-4 w-4 ml-2 transition-transform group-hover/btn:translate-x-1 ${expandedTrends.has(trend.id) ? 'rotate-90' : ''}`} />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            
            {filteredTrends.length === 0 && (
              <motion.div 
                className="text-center py-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="max-w-md mx-auto">
                  <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No trends found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </motion.section>
      </main>
      
      <Footer />
    </div>
  );
};

export default TourismTrends;
