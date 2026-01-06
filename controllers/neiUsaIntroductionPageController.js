import NeiUsaIntroductionPage from '../models/NeiUsaIntroductionPage.js';

// Get NEI USA Introduction page data (Public)
export const getNeiUsaIntroductionPage = async (req, res) => {
  try {
    const page = await NeiUsaIntroductionPage.findOne({ is_active: true })
      .select('-__v')
      .lean();
    
    // Return default demo data if page doesn't exist
    if (!page) {
      const defaultPageData = {
        heroSection: {
          title: "New Educational Initiative Corp",
          subtitle: "Making Quality Education Accessible to All",
          description: "A non-profit organization committed to making quality education accessible to all. We believe every young mind deserves the opportunity to learn and grow, regardless of background, geography, or circumstance."
        },
        aboutSection: {
          heading: "About NEIUSA",
          description: "New Educational Initiative Corp is a non-profit organization committed to making quality education accessible to all. We believe every young mind deserves the opportunity to learn and grow, regardless of background, geography, or circumstance. Our mission is to bring inclusive and transformative learning to underserved communities — including underprivileged youth, immigrants, Native American youth, and those affected by socio-economic or systemic barriers.",
          image: "/assets/images/NEIStudentImage.png"
        },
        visionSection: {
          heading: "Our Vision",
          description: "To create a future where education is a right, not a privilege — empowering students to reach their full potential and contribute meaningfully to society.",
          icon: "👁️"
        },
        missionSection: {
          heading: "Our Mission",
          missionItems: [
            "Provide accessible and low cost education to underserved learners",
            "Develop innovative and relevant learning programs",
            "Promote equity, diversity, and inclusion in education",
            "Foster leadership, critical thinking, and empowerment among youth"
          ],
          icon: "🎯"
        },
        whoWeServeSection: {
          heading: "Who We Serve",
          description: "NEIUSA focuses on marginalized and underserved groups, including:",
          image: "/assets/images/Picture2.png",
          items: [
            {
              _id: "demo-1",
              title: "Immigrant Youth",
              description: "Supporting immigrant youth in overcoming language barriers and integrating into American society.",
              display_order: 1
            },
            {
              _id: "demo-2",
              title: "Native American Youth",
              description: "Dedicated to uplifting through education, mentorship, and cultural preservation.",
              display_order: 2
            },
            {
              _id: "demo-3",
              title: "Youth in or coming out of incarceration",
              description: "Empowering through tailored educational programs and personalized support.",
              display_order: 3
            },
            {
              _id: "demo-4",
              title: "Youth from disadvantaged urban and rural communities",
              description: "Providing accessible education to underserved communities regardless of location.",
              display_order: 4
            }
          ]
        },
        whatWeOfferSection: {
          heading: "What We Offer",
          image: "/assets/images/Picture3.png",
          items: [
            {
              _id: "demo-5",
              title: "Blended Learning Models",
              description: "Combining online and offline teaching for flexible and effective learning.",
              display_order: 1
            },
            {
              _id: "demo-6",
              title: "Counseling and Mentorship",
              description: "Providing holistic growth support through dedicated guidance and mentorship.",
              display_order: 2
            },
            {
              _id: "demo-7",
              title: "Foundational Education and Skill-based Training",
              description: "Building strong educational foundations with practical skill development.",
              display_order: 3
            },
            {
              _id: "demo-8",
              title: "Volunteer and Community Engagement Opportunities",
              description: "Creating meaningful connections and community involvement programs.",
              display_order: 4
            }
          ]
        },
        joinUsSection: {
          heading: "Join Us",
          description: "Whether as a learner, volunteer, donor, or partner — your support strengthens our mission of building equitable access to education for all.",
          buttonText: "Get Involved",
          buttonLink: "https://neiusa.org/"
        }
      };

      return res.status(200).json({
        success: true,
        data: defaultPageData
      });
    }
    
    // Sort arrays by display_order
    if (page.whoWeServeSection?.items) {
      page.whoWeServeSection.items.sort((a, b) => {
        const orderA = a.display_order || 0;
        const orderB = b.display_order || 0;
        if (orderA === orderB) {
          return a._id.toString().localeCompare(b._id.toString());
        }
        return orderA - orderB;
      });
    }
    
    if (page.whatWeOfferSection?.items) {
      page.whatWeOfferSection.items.sort((a, b) => {
        const orderA = a.display_order || 0;
        const orderB = b.display_order || 0;
        if (orderA === orderB) {
          return a._id.toString().localeCompare(b._id.toString());
        }
        return orderA - orderB;
      });
    }
    
    res.status(200).json({
      success: true,
      data: page
    });
  } catch (error) {
    console.error('Error fetching NEI USA Introduction page:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch NEI USA Introduction page data',
      error: error.message
    });
  }
};

