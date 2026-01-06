import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import donationRoutes from "./routes/donationRoutes.js";
import cors from "cors";
import donorUserRoutes from "./routes/donorUserRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import carouselRoutes from "./routes/carouselRoutes.js";
import videoCardsRoutes from "./routes/videoCardsRoutes.js";
import heroSectionRoutes from "./routes/heroSectionRoutes.js";
import bulletPointsRoutes from "./routes/bulletPointsRoutes.js";
import testimonialsRoutes from "./routes/testimonialsRoutes.js";
import sectionsRoutes from "./routes/sectionsRoutes.js";
import volunteerRoutes from "./routes/volunteerRoutes.js";
import contactRouters from "./routes/contactRoutes.js";
import subscribeRoutes from "./routes/subscribeRoutes.js";
import path from 'path';
import morgan from 'morgan';
import { fileURLToPath } from 'url';
import LeadershipRoutes from "./routes/LeadershipRoutes.js";
import galleryRoutes from "./routes/galleryRoutes.js";
import partnerInstitutionRoutes from "./routes/partnerInstitutionRoutes.js";
import careerPageRoutes from "./routes/careerPageRoutes.js";
import globalPartnersPageRoutes from "./routes/globalPartnersPageRoutes.js";
import introductionPageRoutes from "./routes/introductionPageRoutes.js";
import leadershipPageRoutes from "./routes/leadershipPageRoutes.js";
import partneringInstitutionPageRoutes from "./routes/partneringInstitutionPageRoutes.js";
import remoteLearningPageRoutes from "./routes/remoteLearningPageRoutes.js";
import blendedLearningPageRoutes from "./routes/blendedLearningPageRoutes.js";
import homePageRoutes from "./routes/homePageRoutes.js";
import discourseOrientedPedagogyPageRoutes from "./routes/discourseOrientedPedagogyPageRoutes.js";
import applicationOfTechnologyPageRoutes from "./routes/applicationOfTechnologyPageRoutes.js";
import reportsFinancialsPageRoutes from "./routes/reportsFinancialsPageRoutes.js";
import elementaryMiddleSchoolPageRoutes from "./routes/elementaryMiddleSchoolPageRoutes.js";
import slumChildrenPageRoutes from "./routes/slumChildrenPageRoutes.js";
import publicGovernmentSchoolPageRoutes from "./routes/publicGovernmentSchoolPageRoutes.js";
import neiUsaIntroductionPageRoutes from "./routes/neiUsaIntroductionPageRoutes.js";
import softSkillTrainingPageRoutes from "./routes/softSkillTrainingPageRoutes.js";
import girlsEducationPageRoutes from "./routes/girlsEducationPageRoutes.js";
import partnersJoinPageRoutes from "./routes/partnersJoinPageRoutes.js";
import globalEducationPageRoutes from "./routes/globalEducationPageRoutes.js";
import technicalSkillTrainingRoutes from "./routes/TechnicalSkillTrainingRoutes.js";
import madrasaPageRoutes from "./routes/madrasaPageRoutes.js";
import teachersTrainingPageRoutes from "./routes/teachersTrainingPageRoutes.js";
import privacyPolicyPageRoutes from "./routes/privacyPolicyPageRoutes.js";
import beAPartnerPageRoutes from "./routes/beAPartnerPageRoutes.js";
import outOfSchoolDropoutPageRoutes from "./routes/outOfSchoolDropoutPageRoutes.js";
import adultEducationPageRoutes from "./routes/adultEducationPageRoutes.js";
import newsRoutes from "./routes/newsRoutes.js";
import socialEmbedRoutes from "./routes/socialEmbedRoutes.js";

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config();

connectDB();

const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(morgan('dev'))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', "PATCH"],
}));

app.use("/donation", donationRoutes);
app.use("/donor", donorUserRoutes);
app.use("/admin", adminRoutes);
app.use("/course", courseRoutes);
app.use("/carousel", carouselRoutes);
app.use("/video-cards", videoCardsRoutes);
app.use("/hero-section", heroSectionRoutes);
app.use("/bullet-points", bulletPointsRoutes);
app.use("/testimonials", testimonialsRoutes);
app.use("/Leadership", LeadershipRoutes);
app.use("/leadership-page", leadershipPageRoutes);
app.use("/gallery", galleryRoutes);
app.use("/partner-institution", partnerInstitutionRoutes);
app.use("/career-page", careerPageRoutes);
app.use("/global-partners-page", globalPartnersPageRoutes);
app.use("/introduction-page", introductionPageRoutes);
app.use("/partnering-institution-page", partneringInstitutionPageRoutes);
app.use("/remote-learning-page", remoteLearningPageRoutes);
app.use("/blended-learning-page", blendedLearningPageRoutes);
app.use("/homepage", homePageRoutes);
app.use("/discourse-oriented-pedagogy-page", discourseOrientedPedagogyPageRoutes);
app.use("/application-of-technology-page", applicationOfTechnologyPageRoutes);
app.use("/reports-financials-page", reportsFinancialsPageRoutes);
app.use("/elementary-middle-school-page", elementaryMiddleSchoolPageRoutes);
app.use("/slum-children-page", slumChildrenPageRoutes);
app.use("/public-government-school-page", publicGovernmentSchoolPageRoutes);
app.use("/nei-usa-introduction-page", neiUsaIntroductionPageRoutes);
app.use("/soft-skill-training-page", softSkillTrainingPageRoutes);
app.use("/girls-education-page", girlsEducationPageRoutes);
app.use("/partners-join-page", partnersJoinPageRoutes);
app.use("/technical-skill-training-page", technicalSkillTrainingRoutes);
app.use("/madrasa-page", madrasaPageRoutes);
app.use("/out-of-school-dropout-page", outOfSchoolDropoutPageRoutes);
app.use("/global-education-page", globalEducationPageRoutes);
app.use("/adult-education-page", adultEducationPageRoutes);
app.use("/teachers-training-page", teachersTrainingPageRoutes);
app.use("/privacy-policy-page", privacyPolicyPageRoutes);
app.use("/be-a-partner-page", beAPartnerPageRoutes);
app.use("/news", newsRoutes);
app.use("/social-embeds", socialEmbedRoutes);

app.use("/sections", sectionsRoutes);
app.use("/volunteer", volunteerRoutes);
app.use("/contact", contactRouters);
app.use("/subscribe", subscribeRoutes);

app.use((err, req, res, next) => {
    return res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Somthing Went Wrong!',
    })
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));