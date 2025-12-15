-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Dec 13, 2025 at 04:29 PM
-- Server version: 11.8.3-MariaDB-log
-- PHP Version: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `u431247581_vilostudios`
--

-- --------------------------------------------------------

--
-- Table structure for table `about_content`
--

CREATE TABLE `about_content` (
  `id` int(11) NOT NULL,
  `section` varchar(50) NOT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `about_content`
--

INSERT INTO `about_content` (`id`, `section`, `content`, `created_at`, `updated_at`) VALUES
(1, 'about_us', '<h2>Who We Are</h2><p><strong>Vilostudios</strong> is a full-scale, all-in-one anime and manga production company dedicated to redefining the way stories are created and delivered. Our mission is to combine <strong>creative freedom, technical excellence, and fair collaboration</strong> under one roof while embracing a modern, global approach to production.</p><p>We handle every stage of the production pipeline in-house, including:</p><ul><li><strong>Writing &amp; Story Development</strong> – from original concepts to scripts and storyboards.</li><li><strong>Character, Mecha, and Prop Design</strong> – crafting the visual identity of every project.</li><li><strong>2D Animation</strong> – from key animation (原画 / Genga) and in-betweens (動画 / Douga) to animation direction (作画監督 / Sakkan).</li><li><strong>3D Animation &amp; CG Integration</strong> – including modeling (モデラー), rigging (リガー / Technical Artist), and CG animation (CGアニメーター).</li><li><strong>Color &amp; Finishing</strong> – coloring, line cleanup, and palette management (仕上げ / Shiage, 色指定 / Iro Shitei).</li><li><strong>Compositing &amp; Post-Production</strong> – compositing (撮影 / Satsuei), effects, and final edits.</li><li><strong>Sound &amp; Music</strong> – voice acting, sound design, and musical scoring.</li></ul><p>Our <strong>remote-friendly pipeline</strong> allows top-tier talent from around the world to collaborate efficiently while maintaining flexibility. This approach helps us <strong>reduce production bottlenecks, streamline communication, and ensure consistent high-quality output</strong> across every project.</p><p><br></p><p><br></p><h3><strong>Our Philosophy</strong></h3><ol><li><strong>Creator-Focused Production</strong> – We prioritize artists’ and creators’ needs, offering fair compensation, clear schedules, and opportunities for skill development.</li><li><strong>Integrated Workflow</strong> – By keeping all aspects of production under one roof, we minimize delays, miscommunication, and quality loss.</li><li><strong>Global Collaboration</strong> – Vilostudios welcomes international talent, providing opportunities for artists from anywhere to participate in professional anime projects.</li><li><strong>Innovation &amp; Quality</strong> – We embrace both traditional 2D techniques and modern 3D pipelines, ensuring our projects are visually stunning and technically polished.</li><li><strong>Transparency &amp; Community Engagement</strong> – For our original works, we aim to involve fans in supporting projects and witnessing the creative process, creating a sustainable ecosystem for anime and manga.</li></ol><p><br></p><h3><strong>Why Work With Us?</strong></h3><ul><li>Flexible <strong>remote freelance opportunities</strong> with a global team.</li><li>Fair and transparent <strong>compensation</strong>, negotiated per cut, episode, or project.</li><li>Exposure to <strong>high-quality anime production</strong>, including both 2D and 3D integration.</li><li>Opportunities for <strong>career growth</strong>, skill development, and collaboration with industry veterans.</li><li>A creative environment that <strong>values your voice</strong> and your contributions.</li></ul><p><br></p>', '2025-10-24 19:33:14', '2025-10-28 15:54:48'),
(2, 'leadership', '<h2><strong>Our Leadership Team</strong></h2><p><br></p><p><strong>Kevin MD</strong> – <em>CEO &amp; Audio Director</em></p><p> A professional sound designer with a track record of excellence, Kevin has contributed to acclaimed projects such as <strong>To Be Hero X</strong>, <strong>Solo Leveling</strong>, and <strong>Jujutsu Kaisen 0, </strong>and studios like<strong> </strong> <strong>A-1 Pictures</strong>. At Vilostudios, he leads with a vision for outstanding audio production and creative direction.</p><p><br></p><p><br></p><p><strong>Taqi Falsafi</strong> – <em>Animation Director</em></p><p> An experienced animation director, Taqi has worked on high-profile series including <strong>Solo Leveling</strong> with <strong>A-1 Pictures</strong>. He brings expert animation knowledge and creative leadership to Vilostudios, ensuring every production achieves stunning visual quality.</p>', '2025-10-24 19:33:14', '2025-10-28 17:03:38'),
(3, 'mission', '<h2><strong>Our Mission</strong></h2><p>At <strong>Vilostudios</strong>, our mission is to <strong>create exceptional audio and visual content that inspires and resonates with audiences worldwide</strong>. We are committed not only to delivering high-quality productions but also to <strong>preserving the artistry of animation</strong> while pushing its boundaries through innovation, technology, and sustainable practices.</p><p>We recognize the systemic challenges facing the anime industry, from outdated workflows and fragmented pipelines to underfunded studios and overworked talent. Vilostudios exists to <strong>solve these challenges by building a modern, fully integrated production studio</strong> that empowers creators, nurtures talent, and elevates the craft of animation.</p><p>We believe in:</p><p><br></p><p><strong>Quality Craftsmanship</strong> – Every project is approached with meticulous attention to detail, from storytelling and design to animation and sound, ensuring the highest artistic standards.</p><p><br></p><p><strong>Innovation &amp; Creative Problem-Solving</strong> – We develop proprietary tools, workflows, and techniques to enhance efficiency, streamline production, and combine traditional artistry with modern technology.</p><p><br></p><p><strong>Empowering Creators</strong> – We invest in our artists, animators, and creators, providing opportunities to grow, experiment, and thrive, expanding the global talent pool while maintaining the human touch at the heart of animation.</p><p><br></p><p><strong>Sustainable, In-House Production</strong> – By maintaining multiple departments internally—including writing, design, animation, 3D, sound, and post-production—we reduce bottlenecks, preserve creative control, and work toward a self-sustaining studio model.</p><p><br></p><p><strong>Developing Original IPs</strong> – Beyond service work, we aim to create and own our own intellectual properties, telling unique stories, controlling creative vision, and building worlds for audiences globally.</p><p><br></p><p><strong>Building Transparent Partnerships</strong> – We cultivate trust and collaboration with clients, freelancers, and industry partners, creating a professional environment that values quality, fairness, and shared success.</p><p><br></p><p>At Vilostudios, we are <strong>more than a production studio</strong>. We are a creative ecosystem dedicated to <strong>preserving the art of animation, empowering the people who make it, and pioneering a sustainable model for the future of the anime industry</strong>.</p>', '2025-10-24 19:33:14', '2025-10-28 16:03:34');

-- --------------------------------------------------------

--
-- Table structure for table `admin_users`
--

CREATE TABLE `admin_users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `last_login` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `admin_users`
--

INSERT INTO `admin_users` (`id`, `email`, `password_hash`, `created_at`, `last_login`) VALUES
(1, 'kevin@vilostudios.com', 'Tankcrev#1', '2025-10-22 08:05:17', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `anime_roles`
--

CREATE TABLE `anime_roles` (
  `id` int(11) NOT NULL,
  `category` varchar(100) NOT NULL,
  `japanese` varchar(255) NOT NULL,
  `romaji` varchar(255) NOT NULL,
  `english` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `anime_roles`
--

INSERT INTO `anime_roles` (`id`, `category`, `japanese`, `romaji`, `english`, `created_at`) VALUES
(1, 'Planning & Production', '企画', 'Kikaku', 'Project Planning / Planner', '2025-10-22 08:05:17'),
(2, 'Planning & Production', '原作', 'Gensaku', 'Original Work / Story Creator', '2025-10-22 08:05:17'),
(3, 'Planning & Production', 'プロデューサー', 'Producer', 'Producer', '2025-10-22 08:05:17'),
(4, 'Planning & Production', '制作プロデューサー', 'Seisaku Producer', 'Production Producer', '2025-10-22 08:05:17'),
(5, 'Planning & Production', '企画プロデューサー', 'Kikaku Producer', 'Planning Producer', '2025-10-22 08:05:17'),
(6, 'Planning & Production', 'アシスタントプロデューサー', 'Assistant Producer', 'Assistant Producer', '2025-10-22 08:05:17'),
(7, 'Planning & Production', '制作デスク', 'Seisaku Desk', 'Production Coordinator / Desk', '2025-10-22 08:05:17'),
(8, 'Planning & Production', '制作進行', 'Seisaku Shinkō', 'Production Assistant / Progress Manager', '2025-10-22 08:05:17'),
(9, 'Planning & Production', '制作担当', 'Seisaku Tantō', 'Production Manager', '2025-10-22 08:05:17'),
(10, 'Planning & Production', '制作ラインプロデューサー', 'Seisaku Line Producer', 'Line Producer', '2025-10-22 08:05:17'),
(11, 'Planning & Production', '制作会社', 'Seisaku Gaisha', 'Production Company', '2025-10-22 08:05:17'),
(12, 'Planning & Production', '制作協力', 'Seisaku Kyōryoku', 'Production Cooperation (support studio)', '2025-10-22 08:05:17'),
(13, 'Planning & Production', '監修', 'Kanshū', 'Supervisor', '2025-10-22 08:05:17'),
(14, 'Planning & Production', '総監修', 'Sōkanshū', 'Chief Supervisor', '2025-10-22 08:05:17'),
(15, 'Direction & Story', '監督', 'Kantoku', 'Director', '2025-10-22 08:05:17'),
(16, 'Direction & Story', '総監督', 'Sōkantoku', 'Chief Director', '2025-10-22 08:05:17'),
(17, 'Direction & Story', '副監督 / 助監督', 'Fukukantoku / Jokantoku', 'Assistant Director', '2025-10-22 08:05:17'),
(18, 'Direction & Story', '演出', 'Enshutsu', 'Episode Director / Direction', '2025-10-22 08:05:17'),
(19, 'Direction & Story', '絵コンテ', 'Ekonte', 'Storyboard Artist', '2025-10-22 08:05:17'),
(20, 'Direction & Story', 'シリーズ構成', 'Series Kōsei', 'Series Composition / Head Writer', '2025-10-22 08:05:17'),
(21, 'Direction & Story', '脚本', 'Kyakuhon', 'Screenwriter', '2025-10-22 08:05:17'),
(22, 'Direction & Story', '脚本監修', 'Kyakuhon Kanshū', 'Script Supervisor', '2025-10-22 08:05:17'),
(23, 'Direction & Story', '脚本協力', 'Kyakuhon Kyōryoku', 'Script Assistance', '2025-10-22 08:05:17'),
(24, 'Direction & Story', '構成協力', 'Kōsei Kyōryoku', 'Structure Support', '2025-10-22 08:05:17'),
(25, 'Direction & Story', 'コンテチェック', 'Conte Check', 'Storyboard Checker', '2025-10-22 08:05:17'),
(26, 'Design & Concept', 'キャラクターデザイン', 'Character Design', 'Character Designer', '2025-10-22 08:05:17'),
(27, 'Design & Concept', '総作画監督', 'Sōsakuga Kantoku', 'Chief Animation Director', '2025-10-22 08:05:17'),
(28, 'Design & Concept', '作画監督', 'Sakuga Kantoku', 'Animation Director', '2025-10-22 08:05:17'),
(29, 'Design & Concept', 'サブキャラクターデザイン', 'Sub Character Design', 'Sub Character Designer', '2025-10-22 08:05:17'),
(30, 'Design & Concept', 'メカニックデザイン', 'Mechanic Design', 'Mechanical Designer', '2025-10-22 08:05:17'),
(31, 'Design & Concept', 'モンスターデザイン', 'Monster Design', 'Monster Designer', '2025-10-22 08:05:17'),
(32, 'Design & Concept', 'プロップデザイン', 'Prop Design', 'Prop Designer', '2025-10-22 08:05:17'),
(33, 'Design & Concept', 'コンセプトアート', 'Concept Art', 'Concept Artist', '2025-10-22 08:05:17'),
(34, 'Design & Concept', 'ビジュアルデザイン', 'Visual Design', 'Visual Designer', '2025-10-22 08:05:17'),
(35, 'Design & Concept', 'アートディレクション', 'Art Direction', 'Art Director', '2025-10-22 08:05:17'),
(36, 'Design & Concept', '美術設定', 'Bijutsu Settei', 'Art Setting / Environment Design', '2025-10-22 08:05:17'),
(37, 'Design & Concept', 'デザインワークス', 'Design Works', 'Design Work Artist', '2025-10-22 08:05:17'),
(38, 'Design & Concept', '小物設定', 'Komono Settei', 'Small Props Designer', '2025-10-22 08:05:17'),
(39, 'Design & Concept', 'CGデザイン', 'CG Design', '3D/CG Designer', '2025-10-22 08:05:17'),
(40, 'Animation', '原画', 'Genga', 'Key Animator', '2025-10-22 08:05:17'),
(41, 'Animation', '第二原画', 'Daini Genga', 'Second Key Animator', '2025-10-22 08:05:17'),
(42, 'Animation', '動画', 'Dōga', 'In-Between Animator', '2025-10-22 08:05:17'),
(43, 'Animation', '動画検査', 'Dōga Kensa', 'In-Between Checker', '2025-10-22 08:05:17'),
(44, 'Animation', '作画', 'Sakuga', 'Animation (general)', '2025-10-22 08:05:17'),
(45, 'Animation', '作画監督補佐', 'Sakuga Kantoku Hosa', 'Assistant Animation Director', '2025-10-22 08:05:17'),
(46, 'Animation', '総作画監督補佐', 'Sōsakuga Kantoku Hosa', 'Assistant Chief Animation Director', '2025-10-22 08:05:17'),
(47, 'Animation', '作画協力', 'Sakuga Kyōryoku', 'Animation Assistance', '2025-10-22 08:05:17'),
(48, 'Animation', '作画監修', 'Sakuga Kanshū', 'Animation Supervisor', '2025-10-22 08:05:17'),
(49, 'Animation', '作画チーフ', 'Sakuga Chief', 'Chief Animator', '2025-10-22 08:05:17'),
(50, 'Background Art & Color', '美術監督', 'Bijutsu Kantoku', 'Art Director', '2025-10-22 08:05:17'),
(51, 'Background Art & Color', '美術設定', 'Bijutsu Settei', 'Art Setting / Environment Designer', '2025-10-22 08:05:17'),
(52, 'Background Art & Color', '背景美術', 'Haikei Bijutsu', 'Background Art', '2025-10-22 08:05:17'),
(53, 'Background Art & Color', '背景監督', 'Haikei Kantoku', 'Background Director', '2025-10-22 08:05:17'),
(54, 'Background Art & Color', '美術ボード', 'Bijutsu Board', 'Art Board Painter', '2025-10-22 08:05:17'),
(55, 'Background Art & Color', '色彩設計', 'Shikisai Sekkei', 'Color Designer', '2025-10-22 08:05:17'),
(56, 'Background Art & Color', '色指定', 'Shikishitei', 'Color Stylist', '2025-10-22 08:05:17'),
(57, 'Background Art & Color', '仕上げ', 'Shiage', 'Finishing Artist / Paint', '2025-10-22 08:05:17'),
(58, 'Background Art & Color', '特殊効果', 'Tokushu Kōka', 'Special Effects (2D)', '2025-10-22 08:05:17'),
(59, 'Background Art & Color', '撮影監督', 'Satsuei Kantoku', 'Director of Photography', '2025-10-22 08:05:17'),
(60, 'Background Art & Color', '撮影', 'Satsuei', 'Photography / Compositing', '2025-10-22 08:05:17'),
(61, 'Background Art & Color', '撮影補佐', 'Satsuei Hosa', 'Assistant Photographer', '2025-10-22 08:05:17'),
(62, '3D & Digital', '3DCG監督', '3DCG Kantoku', '3D CG Director', '2025-10-22 08:05:17'),
(63, '3D & Digital', '3DCGデザイン', '3DCG Design', '3D CG Designer', '2025-10-22 08:05:17'),
(64, '3D & Digital', 'CGモデリング', 'CG Modeling', 'CG Modeler', '2025-10-22 08:05:17'),
(65, '3D & Digital', 'CGアニメーション', 'CG Animation', 'CG Animator', '2025-10-22 08:05:17'),
(66, '3D & Digital', 'CGコンポジット', 'CG Composite', 'CG Compositor', '2025-10-22 08:05:17'),
(67, '3D & Digital', 'CGプロデューサー', 'CG Producer', 'CG Producer', '2025-10-22 08:05:17'),
(68, '3D & Digital', 'CGスーパーバイザー', 'CG Supervisor', 'CG Supervisor', '2025-10-22 08:05:17'),
(69, '3D & Digital', 'デジタルペイント', 'Digital Paint', 'Digital Painter', '2025-10-22 08:05:17'),
(70, '3D & Digital', 'デジタル撮影', 'Digital Satsuei', 'Digital Compositing', '2025-10-22 08:05:17'),
(71, 'Sound & Music', '音響監督', 'Onkyō Kantoku', 'Sound Director', '2025-10-22 08:05:17'),
(72, 'Sound & Music', '音響効果', 'Onkyō Kōka', 'Sound Effects', '2025-10-22 08:05:17'),
(73, 'Sound & Music', '音楽', 'Ongaku', 'Music', '2025-10-22 08:05:17'),
(74, 'Sound & Music', '音楽監督', 'Ongaku Kantoku', 'Music Director', '2025-10-22 08:05:17'),
(75, 'Sound & Music', '音楽プロデューサー', 'Ongaku Producer', 'Music Producer', '2025-10-22 08:05:17'),
(76, 'Sound & Music', '音楽制作', 'Ongaku Seisaku', 'Music Production', '2025-10-22 08:05:17'),
(77, 'Sound & Music', '音響制作', 'Onkyō Seisaku', 'Sound Production', '2025-10-22 08:05:17'),
(78, 'Sound & Music', '録音', 'Rokuon', 'Recording', '2025-10-22 08:05:17'),
(79, 'Sound & Music', 'ミキサー', 'Mixer', 'Sound Mixer', '2025-10-22 08:05:17'),
(80, 'Sound & Music', 'フォーリー', 'Fōrī', 'Foley Artist', '2025-10-22 08:05:17'),
(81, 'Sound & Music', '声優', 'Seiyū', 'Voice Actor', '2025-10-22 08:05:17'),
(82, 'Sound & Music', 'キャスティング', 'Casting', 'Casting Director', '2025-10-22 08:05:17'),
(83, 'Sound & Music', 'ADRディレクター', 'ADR Director', 'Dubbing Director', '2025-10-22 08:05:17'),
(84, 'Sound & Music', '音楽協力', 'Ongaku Kyōryoku', 'Music Collaboration', '2025-10-22 08:05:17'),
(85, 'Editing & Post-Production', '編集', 'Henshū', 'Editor', '2025-10-22 08:05:17'),
(86, 'Editing & Post-Production', '編集助手', 'Henshū Joshu', 'Assistant Editor', '2025-10-22 08:05:17'),
(87, 'Editing & Post-Production', 'オンライン編集', 'Online Henshū', 'Online Editor', '2025-10-22 08:05:17'),
(88, 'Editing & Post-Production', 'オフライン編集', 'Offline Henshū', 'Offline Editor', '2025-10-22 08:05:17'),
(89, 'Editing & Post-Production', 'タイミングチェック', 'Timing Check', 'Timing Supervisor', '2025-10-22 08:05:17'),
(90, 'Editing & Post-Production', '撮影編集', 'Satsuei Henshū', 'Composite Editing', '2025-10-22 08:05:17'),
(91, 'Editing & Post-Production', 'テロップ', 'Teloppu', 'Title / Caption Designer', '2025-10-22 08:05:17'),
(92, 'Editing & Post-Production', 'MA', 'MA (Multi Audio)', 'Audio Mixing (Final Mix)', '2025-10-22 08:05:17');

-- --------------------------------------------------------

--
-- Table structure for table `applications`
--

CREATE TABLE `applications` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `role` varchar(255) NOT NULL,
  `department` varchar(100) NOT NULL,
  `coverLetter` text DEFAULT NULL,
  `cv_path` varchar(255) DEFAULT NULL,
  `status` enum('pending','accepted','declined') NOT NULL DEFAULT 'pending',
  `submitted_at` timestamp NULL DEFAULT current_timestamp(),
  `processed_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `applications`
--

INSERT INTO `applications` (`id`, `name`, `email`, `phone`, `role`, `department`, `coverLetter`, `cv_path`, `status`, `submitted_at`, `processed_at`) VALUES
(9, 'Matthew Mai ', 'matthewmai146@gmail.com', '', 'Animation Director (作画監督/Sakkan)', 'animation', 'I am a professional 2D animator and sakkan specialist with hands-on experience correcting key animation, refining character models, and enforcing model consistency across production pipelines. I deliver clear, reliable sakkan corrections that preserve the director’s intent while improving timing, weight, and model fidelity.\r\n\r\nArt Director Correction (Lo-sakkan) on CloverWorks Rascal Does Not Dream of Santa Claus episode 13 where I corrected character models and animation to studio model standards.Art Director Assistant (Sakkan) in Tokyo where I corrected key animation, added production notes, reviewed proofs, and supervised junior artists.\r\n\r\nCharacter Layout Artist at Powerhouse Animation delivering Clip Studio layouts that stayed on model and cleaning up lines in Toon Boom Harmony.\r\n\r\nFreelance 2nd Key and Clean-up roles on multiple productions producing in-betweens, genga clean-up, and storyboard-driven key frames for TV and cinematic work.\r\n\r\n\r\nmatthewmai146.wixsite.com/matthewmai\r\n\r\nYou can see my professional animaiton sakkan work in the animaiton correction. ', 'uploads/cvs/6900eaff55880_MATTHEW_MAI_Resumeupdatesep.pdf', 'accepted', '2025-10-28 16:10:39', '2025-10-28 16:17:22'),
(10, 'Raul Ortiz Campillo', 'razzzus@gmail.com', '', 'Key Animator (原画 / Genga)', 'animation', 'Hello,\r\nI am interested in the position. I am a 2D animator with experience in layout and second key animation (nigen) in the Japanese animation industry.\r\nI have attached my reel for your review.\r\nThank you very much in advance, and I look forward to hearing from you.\r\n\r\nreel: https://www.youtube.com/watch?v=8vZrdJecmzs\r\nsotials: https://x.com/_razzus', 'uploads/cvs/6900edbcc68a8_RaulOrtizRAZZUS2DAnimationResume-ENG.pdf', 'accepted', '2025-10-28 16:22:20', '2025-11-12 16:17:48'),
(12, 'Ardie Walton', 'Buddy2aj@gmail.com', '', 'In-Between Animator (動画 / Douga)', 'animation', 'https://ajwaltonart.wixsite.com/ajwalton', 'uploads/cvs/690100c85f018_ArdieWalton_AnimationResume.docx', 'accepted', '2025-10-28 17:43:36', '2025-11-12 16:41:14'),
(13, 'Haytham Fadhil', 'haythamfadhil@gmail.com', '', 'Finisher / Color Artist (仕上げ / Shiage)', 'color-design', 'https://www.haythamfadhil.com/', 'uploads/cvs/690101ab30fb2_HaythamFadhil_Resume_2024.pdf', 'declined', '2025-10-28 17:47:23', '2025-11-12 16:40:23'),
(16, 'Mrunal Khairnar', 'mrunal.khr@gmail.com', '', 'In-Between Animator (動画 / Douga)', 'animation', 'Hi! My name is Mrunal Khairnar, a 2D character animator based in Paris, France. I have been working as a 2D senior animator for the past 10 years in TV, feature films, and short film animation. \r\n\r\nRecently, I worked on a feature film by Folivari (2D animator), Common Side Effects (2D animator), Love, Death and Robots S4 E8 (\"How Zeke Got Religion\") (clean-up artist), and a few commercials with studios like Golden Wolf, Ritzy Animation & LeCube.tv.\r\n\r\nI am interested in connecting for roles as a 2D animator/ inbetweener. \r\n\r\nI am sharing my showreel and CV for your review.\r\nShowreel: https://mrunalkhairnar.com/nda-showreel-mid-2025\r\nPassword: mak593\r\n\r\nThank you! ', 'uploads/cvs/69012bb5563e0_CV_MrunalKhairnar-AUG2025_ENG.pdf', 'accepted', '2025-10-28 20:46:45', '2025-11-12 16:39:23'),
(18, 'Tyrell Thomas', 'tyrellthomas64@yahoo.com', '', 'Key Animator (原画 / Genga)', 'animation', 'Tyrellthomasportfolio.com', 'uploads/cvs/6901387f37e95_Resume-10.pdf', 'declined', '2025-10-28 21:41:19', '2025-11-12 16:38:23'),
(19, 'Ihmil Herndon', 'ihmilkherndon@gmail.com', '', 'In-Between Animator (動画 / Douga)', 'animation', 'https://www.ihmilkherndon.net/', 'uploads/cvs/690145474af86_Resume2025.pdf', 'declined', '2025-10-28 22:35:51', '2025-11-12 16:37:51'),
(20, 'Rachel Headlam', 'proheadlam@gmail.com', '', 'In-Between Animator (動画 / Douga)', 'animation', 'Demo reel:\r\nhttps://youtu.be/PbyRJf4smWo?si=cn_AsJxtVYJE5RCf\r\nPortfolio:\r\nhttps://www.rachelheadlam.com/vagabonds', 'uploads/cvs/6901667d216de_RachelHeadlam_Animation_Resume_20252.pdf', 'declined', '2025-10-29 00:57:33', '2025-11-12 16:36:27'),
(21, 'Thomas Winn', 'monkuso.103@gmail.com', '', 'Key Animator (原画 / Genga)', 'animation', 'https://www.monkuso.com/animation', 'uploads/cvs/69016d69ac959_ThomasResumeAnimation.pdf', 'accepted', '2025-10-29 01:27:05', '2025-11-12 16:35:32'),
(23, 'Akeem Clarke', 'akeemanese@gmail.com', '', 'Key Animator (原画 / Genga)', 'animation', 'Vilo Studios,\r\n\r\nNice to meet you.\r\n\r\nI am interested in genga work.\r\n\r\nI am also open for douga and shiage as well.\r\n\r\nI am a freelance animator from the U.S. that is based in Tokyo working on Japanese animation.\r\n\r\nPreviously, I worked on Dr. Stone: Science Future and Ginpachi-Sensei.\r\n\r\nHere is a link to my portfolio:\r\nhttps://drive.google.com/drive/folders/1db_ufVItP2FJYfcqo3bzX7ghOod9ORY8\r\n\r\nI am looking forward to working with you.\r\n\r\nThank you for your time and consideration.\r\n', 'uploads/cvs/6901e1cee4043_1.pdf', 'accepted', '2025-10-29 09:43:42', '2025-11-12 16:34:47'),
(30, 'Cameron Jones', 'magazinecadot@gmail.com', '', 'Key Animator (原画 / Genga)', 'animation', 'https://sites.google.com/view/cadotjournal/about?pli=1', NULL, 'declined', '2025-10-29 11:18:22', '2025-11-12 16:32:46'),
(33, 'Kayla Stith', 'kstith714@gmail.com', '', 'In-Between Animator (動画 / Douga)', 'animation', 'https://sites.google.com/view/kaylastithportfolio/animation', 'uploads/cvs/69022e7dd5b2d_KaylaStithResume-Animation.docx', 'accepted', '2025-10-29 15:10:53', '2025-11-12 16:32:03'),
(36, 'solomon geri', 'kingsolomongeri@gmail.com', '', 'Key Animator (原画 / Genga)', 'animation', 'Hello, I am an Experience 2D animator. Ive worked on a lot of different freelance projects over ther past year and a half. This is my Portfolio Reel \r\nhttps://youtu.be/BW5xn9GGpaE ', 'uploads/cvs/690372f6de75b_SolomonsResume.pdf', 'accepted', '2025-10-30 14:15:18', '2025-11-12 16:31:02'),
(41, 'Enrico Antonio Primo Patucci', 'EPatucci57@gmail.com', '', 'CG Animator (CGアニメーター)', '3d-cgi', 'I am an animator who has been using Maya since 2012.  I am comfortable with animating 3D characters with 2D animation principles in mind and also deeply appreciate critical feedback when making my work.   My favorite anime to watch is The Big O and Tree in the Sun. I am an english speaker and have some experience interacting with bilingual jp/en artists I am friends with online.  I have experience learning new animation software for personal projects such as Spine2D, Blender, MMD and Flash and would be happy to learn more if the project requires it.', 'uploads/cvs/69055d5593088_EnricoPatucci-Resume.pdf', 'accepted', '2025-11-01 01:07:33', '2025-11-12 16:30:26'),
(42, 'Mohanad Ahmed', 'mohanadahmed726@gmail.com', '', 'In-Between Animator (動画 / Douga)', 'animation', 'https://drive.google.com/drive/folders/103Ykjxj7G6bndYLC2r6Wngxf0Nmp4UYg', 'uploads/cvs/69056129a6ba3_rirekisho_MohanadAhmed.pdf', 'accepted', '2025-11-01 01:23:53', '2025-11-12 16:27:44'),
(43, 'Elijah Reed', 'smoothbusinessbrain@gmail.com', '', 'Key Animator (原画 / Genga)', 'animation', 'My portfolio:smoothbrainportfolio.online\r\n\r\nSomething about myself is that I love hack and slash (Devil May Cry, UltraKill) how everything is choatic and you have to be brutal but sytlish I find it beautiful. I hopfully can make a animation sequence that like that and add it to my reel.\r\n\r\n\r\n', 'uploads/cvs/69067e62b0669_ElijahReedResume.pdf', 'declined', '2025-11-01 21:40:50', '2025-11-12 16:29:41'),
(44, 'Gabrielle Demarigny', 'gab.demarigny@gmail.com', '', 'Finisher / Color Artist (仕上げ / Shiage)', 'color-design', '\r\nDear Sir or Madam,\r\n\r\nI am Gabrielle Demarigny, and I am a French 2D animator and storyboarder. I am contacting you in order to be able to work for your studio as a Color artist/ Inberween animator as soon as possible.\r\n\r\nI think I will be an asset to your team because I am able to adapt to many graphic and narrative styles, both realistic and more cartoonish. I also have a dynamic and expressive trait, as well as a good sense of timing and posing which will give character and life to your characters.\r\n\r\nI am very excited to be able to join your team to continue my professional life in the animation industry, and to contribute to your projects with my animation skills.\r\n\r\nAttached you will find my CV and my portfolio, in which you can find my demoreels.\r\n\r\nGabaobab.fr\r\n\r\nI remain available for a possible interview, thank you for your attention to my application.\r\nBest regards.\r\nGabrielle\r\n', 'uploads/cvs/690882464cd4f_CV2025ENG.pdf', 'accepted', '2025-11-03 10:21:58', '2025-11-12 16:28:55'),
(46, 'Ghita Hsaine', 'ghitahsaine@gmail.com', '', 'CG Animator (CGアニメーター)', '3d-cgi', 'Dear Vilostudios Team,\r\n\r\nI am writing to express my interest in the CG Animator freelance position at Vilostudios. As a recent graduate from ESMA Toulouse (France), where I completed a 3D animation short film as my final project, I have developed strong storytelling and technical animation skills that I am eager to apply to professional productions.\r\n\r\nDuring my studies, I worked on all stages of a 3D animated short, from pre-production to final rendering, gaining a solid understanding of animation principles, acting, and motion. This experience strengthened my ability to bring characters and scenes to life while collaborating within a creative team.\r\n\r\nAlthough my background is primarily in 3D animation, I have a genuine passion for Japanese animation and the 2D anime aesthetic. The opportunity to contribute to projects that blend traditional anime with modern CG workflows aligns perfectly with both my artistic sensibility and my professional goals.\r\n\r\nI am proficient in Maya and Blender, comfortable working remotely, and always open to feedback to refine my craft. I would be honored to contribute to Vilostudios’ unique approach to combining 2D and 3D animation.\r\n\r\nHere is my Showreel : https://vimeo.com/1048995308?share=copy#t=0\r\n\r\nThank you for considering my application. I would be delighted to provide my demo reel and discuss how I could support your upcoming productions.\r\n\r\nBest regards,\r\nHSAINE Ghita.', 'uploads/cvs/6908c5bd7afae_CV_2025.pdf', 'accepted', '2025-11-03 15:09:49', '2025-11-12 16:27:33'),
(48, 'Rebeca Espindola Recoder', 'bkarecord14@gmail.com', '', 'In-Between Animator (動画 / Douga)', 'animation', 'Dear Vilostudios Team,\r\n\r\nMy name is Rebeca Espíndola Recoder, and I’m a 2D animator and illustrator from Mexico with a degree in Digital Animation from Tecnológico de Monterrey. I define myself as an artist with an animator’s heart and a producer’s mind. This means that I value creativity, storytelling, and acting as much as organization, communication, and meeting deadlines. \r\n\r\nAll my professional experience has been through remote freelance projects, collaborating with mexican and colombian studios for international clients on television, film, and video game productions. I’m proficient in English and currently learning Japanese, though still at a beginner level.\r\n\r\nThroughout my career, I’ve been involved in all stages of the animation process, including rough, clean-up and color. However, I find myself especially thriving and enjoying in-between animation, where I can focus on movement, rhythm, and consistency to bring fluidity and life to every scene.\r\n\r\nI’m very interested in contributing to Vilostudios approach to anime production, and I would be honored to be part of your creative team.\r\nI’m sharing my demo reel and portfolio website below for your consideration.\r\ndemo reel: https://www.beckarecoder.com/demoreeltradigital\r\nPassword: demo RER (make sure to add the space)\r\nportfolio website: https://beckarecoder.com/\r\n\r\nThank you for your time and attention,\r\nRebeca Espíndola Recoder', 'uploads/cvs/6908f2ae5fb6b_Rebeca-Espindola-Recoder-Resume-2025.pdf', 'accepted', '2025-11-03 18:21:34', '2025-11-12 16:27:06'),
(49, 'Yuanli', 'leoyuanli98@gmail.com', '', '3D Modeler (モデラー)', '3d-cgi', '3D artist with professional experience, portfolio: https://www.artstation.com/leonexus6', 'uploads/cvs/690ab32f0a932_LeoYuanli_3DEnvArtist_Resume.pdf', 'accepted', '2025-11-05 02:15:11', '2025-11-12 16:24:38'),
(51, 'Rodrigo Fernandez Poggi', 'rodrigofdzp@gmail.com', '', 'Illustrator/character designer/ vis.dev', 'character-design', 'Hi I\'m Rodrigo, an Director  from Argentina.Im seeking for opportunities.\r\nI specialize in creating visually impactful projects and at the same time make them feasible within the production pipeline.\r\nMy experience let me push the creative boundaries while ensuring the work remains achievable for animation.\r\nWith 9 years of experience working in  animation/advertisement, i\'ve contributed in various roles including Director,Assistant Director,Art Director,Visual Development,Character Design,Storyboarding,Color Key,Layout Supervisor,Background Painting,Animation Assistant,Cleanup/Color and Cleanup Supervisor.\r\n\r\nPortfolio https://rodrigofdzp.myportfolio.com/\r\n\r\nSupervision-Clean up and color-Demo Reel https://vimeo.com/1116278467?share=copy#t=0\r\n\r\nThanks for your time and consideration\r\nKind regards.\r\n', 'uploads/cvs/690ab8ee1cbec_rodrigofernandezpoggi_cv.pdf', 'declined', '2025-11-05 02:39:42', '2025-11-12 16:23:39'),
(52, 'Pakapol Potisaratana', 'athran_punching@hotmail.com', '', 'Key Animator (原画 / Genga)', 'animation', 'https://drive.google.com/file/d/1HNNwQ9DPqxDxOvOVgj4ZA7lDAqEb5ndL/view?usp=sharing', 'uploads/cvs/690ad55072a63_Resume_Pakapol_compressed.pdf', 'declined', '2025-11-05 04:40:48', '2025-11-12 16:22:20'),
(53, 'Hermelinda Vilar', 'hvilarpablos1993@gmail.com', '', 'In-Between Animator (動画 / Douga)', 'animation', 'Hello! My name is Herme and I am a 3D generalist and animator with a lot interest in 2D creation. You can see some of my works here: https://www.laaberricida.com/', 'uploads/cvs/690b00e3622f3_Resume26_HermelindaVilarPablos.pdf', 'declined', '2025-11-05 07:46:43', '2025-11-12 16:21:44'),
(57, 'Ryanne Angeli Emmanuelle Yana', 'eliyana1311@gmail.com', '', 'Concept Artist', 'character-design', 'https://tlmelspreclous.carrd.co \r\nI would like to apply for this position as it aligns with my skills and interests, I hope to learn and gain knowledge through this department, and hone my skills further. \r\n\r\nThank you for this opportunity.', 'uploads/cvs/690b087368f8b_Resume_10192024-Yana.pdf', 'accepted', '2025-11-05 08:18:59', '2025-11-12 16:18:25'),
(59, 'Deborah Balboa', 'balboa_deborah@outlook.com', '', 'Finisher / Color Artist (仕上げ / Shiage)', 'color-design', 'https://debbiebalboa.pb.online/', 'uploads/cvs/690b1cc13f7f2_DebbieBalboa_CV2025.pdf', 'accepted', '2025-11-05 09:45:37', '2025-11-12 16:15:44'),
(64, 'Tuyen Ngo', 'twinngo1699@gmail.com', '', 'Character Designer, Illustrator', 'character-design', 'My name is Ngo Pham Tuyen, but feel free to call me Twin. I’m a 2D illustrator with about five years of experience, mainly working in digital painting. I focus on TCG/CCG art, splash art, keyframes, illustrations, and concept art, too. Photoshop is my go-to tool for most of my work. Over the year i worked for some studio such as Devoted Studio, Share Creator, GameQbator Labs, Seedworld Studio... to create illustration, concept art, props design, character skinn,..  for game such as Seedworld, Seeker of Skyveil, Metazoo,...\r\nYou can view my portfolio here: https://www.artstation.com/twinngo', 'uploads/cvs/690b26cfee49b_Twinngo_Resume.pdf', 'accepted', '2025-11-05 10:28:31', '2025-11-12 16:14:55'),
(66, 'Brian Yuen', 'brianyuenart@gmail.com', '', '2D concept artist/ character designer/ 2D background painter', 'character-design', 'Hi Vilo Studios, \r\n\r\nI am Brian Yuen, a freelance concept artist based in Hong Kong, I do both concept art and illustration work, and I do both characters and environments/props. I mainly work in a anime inspired style as well as in painterly style. Here is my portfolio: https://www.brianyuenart.com/ \r\nWould love to know whether my work would be a good fit for your projects, thank you so much for your time!\r\n\r\nBest,\r\nBrian Yuen', 'uploads/cvs/690b277f2da41_Resume_BrianYuen2025.pdf', 'accepted', '2025-11-05 10:31:27', '2025-11-12 16:14:11'),
(67, 'Paul Pislea', 'paul.pislea@gmail.com', '', '3D Artist Generalist', '3d-cgi', 'https://www.artstation.com/paul_pislea', 'uploads/cvs/690b4f16dd697_PaulPislea_Resume_2025.pdf', 'accepted', '2025-11-05 13:20:22', '2025-11-12 16:13:43'),
(68, 'Prarthin Bhatt', 'prarthin@gmail.com', '', 'Finisher / Color Artist (仕上げ / Shiage)', 'color-design', 'I am a versatile artist and am interested in everything creative which puts my artistic abilities to practice. I have a unique vision for my art and am constantly looking to grow my skills for my personal art journey. I am fascinated by imaginary worlds and want to contribute to making more of them.', 'uploads/cvs/690b51d25d703_PrarthinCV.pdf', 'declined', '2025-11-05 13:32:02', '2025-11-12 16:13:38'),
(70, 'Kimberly Gouge', 'kottonpopart@gmail.com', '', 'In-Between Animator (動画 / Douga)', 'animation', 'https://www.kottonpop.com/\r\n\r\nI recently finished an Animation Lead position for Branch studios and have worked with Bento Box and Floyd County Productions as a Character designer, Toon Boom Rig lead, and 2D Animator. \r\n\r\nAll my personal work has been anime focused and i have become very interested in the Sakuga process and would love to be involved in one of the studios productions as a genga or douga! ', 'uploads/cvs/690b57da469d7_Resume_2025.pdf', 'accepted', '2025-11-05 13:57:46', '2025-11-12 16:10:20'),
(73, 'Jonathan Aguillon', 'jonathan.f.aguillon@gmail.com', '', 'Concept artist', 'character-design', 'https://www.artstation.com/jonathanaguillon', 'uploads/cvs/690b7eb05a91b_Jonathan_Aguillon_ATS_Resume.pdf', 'accepted', '2025-11-05 16:43:28', '2025-11-12 16:09:55'),
(76, 'Alex Hidalgo ', 'alekazoo101@gmail.com', '', 'Finisher / Color Artist (仕上げ / Shiage)', 'color-design', 'alekazoo101.wixsite.com/portfolio', 'uploads/cvs/690ba6990b49c_ViloStudios_Alex_Hidalgo_Resume.pdf', 'accepted', '2025-11-05 19:33:45', '2025-11-12 16:09:25'),
(80, 'Lydia Philips', 'lydia.b.philips@gmail.com', '', 'Finisher / Color Artist (仕上げ / Shiage)', 'color-design', 'https://www.lydiabphilipsart.com/\r\n\r\nTo whom it may concern,\r\nThank you for taking the time out of your day to receive this letter and the attached resume. My name is Lydia B. Philips, I am an alumni of the Laguna College of Art + Design, receiving my BFA in Experimental Animation in May of 2025. I would like to express my enthusiastic interest in working with you.\r\nI have a long time love of storytelling, fantasy, and art. I find that even the most fantastical of words need logical hands helping to create them, and that is where I thrive. I have many times been complimented on my analytical and introspective skills. Despite my passion for art and creativity, I very much thrive in a production role– spreadsheets and documents of notes. My introspective nature has allowed me to grow by looking inward and examining myself through a logical lens. I do not believe in half-done work, as I think it reflects poorly on myself and any team I may be a part of. I believe amazing things can be achieved when careful planning and pure unbridled passion come together– and that is what I will bring to your team. \r\nI have been telling stories for longer than I can remember, and drawing for nearly as long. Over the course of my education at the Laguna College of Art + Design, I have managed the production of many animations, hitting my stride working in programs like Adobe After Effects, and Zbrush. While I came to LCAD to study animation, I discovered a new passion for other points on the pipeline– above all else, art direction and compositing. In working on my thesis film, Grand Guardians: Creation Myth, I have managed every point and detail of production– from pitch to final render. This has cultivated a well-rounded skill set that helps me remain unintimidated in the face of new challenges. Like I touched on earlier, approach things with a healthy combination of logic and passion, and anything can be overcome.\r\nI am humbled and honored to receive your consideration today, and I hope to hear from you soon. Regardless of if I do or not, I wish you the best in all your endeavors. \r\n', 'uploads/cvs/690bbb0956ac2_LydiaBP_resume2025_GEN7.pdf', 'accepted', '2025-11-05 21:00:57', '2025-11-12 16:08:20'),
(85, 'Arturo Angelo Frio', 'junifrio7@gmail.com', '', 'Character Concept Artist', 'character-design', 'Hi\r\n\r\nMy name is Arturo Frio, but please call me Juni. I am confident that my skills and experience make me a strong candidate for this role.\r\n\r\nSome notable trainings in 2023:\r\n- TB Choi Mentorship (Valorant, Overwatch)\r\n- Even Amundsen character course (Blizzard, Riot, Etc)\r\n\r\nMy projects since 2017:\r\n- Call of Duty: Mobile\r\n- The Last of Us franchise\r\n- Cyberpunk 2077\r\n- Diablo IV\r\n- Suicide Squad\r\n- Just Cause 4\r\n- Shadow of the Tomb Raider\r\n- Silent Hill Ascension\r\n\r\nI have attached my samples and a link to my online portfolio for your review. I am available to discuss my qualifications and experience at your convenience and look forward to an opportunity to meet with you.\r\n\r\nPortfolio Link: www.frioconceptstudio.com/character\r\n\r\nThank you for your time and consideration.\r\n\r\nSincerely,\r\nJuni\r\n', 'uploads/cvs/690bcf6f0a0b0_JuniFrio-Resume.pdf', 'accepted', '2025-11-05 22:27:59', '2025-11-12 16:07:41'),
(87, 'Kaylon M Membreno', 'kaylonsadventureawaits@gmail.com', '', 'Finisher / Color Artist (仕上げ / Shiage)', 'color-design', 'Hello Vilostudios!\r\n\r\nMy name is Kaylon, and I would love to be considered for this opportunity! I am sending a link to my current portfolio with my 2D reel included.\r\n\r\nPortfolio: https://kaylonmembreno.wixsite.com/adventure\r\n\r\nThank you for taking the time to read this, and I hope you have a great day!', 'uploads/cvs/690bda044939b_KaylonAdventureMembrenoResume2025.pdf', 'accepted', '2025-11-05 23:13:08', '2025-11-12 16:06:36'),
(89, 'Andrea Preciado', 'amile1108@gmail.com', '', 'CG Animator (CGアニメーター)', '3d-cgi', 'I have worked at Lakeside Animation Studios in Ontario Canada, as a Character and prop Designer. Moreover, I have an equivalent combination of education and experience, so I have a lot of experience using different 3D programs, video-editing, illustrations, pre and post production, graphic design, and 2D and 3D animations.\r\nhttps://amile1108.wixsite.com/andrea_preciado_art', 'uploads/cvs/690beba408271_AndreaP_Resume.pdf', 'accepted', '2025-11-06 00:28:20', '2025-11-12 16:06:22'),
(90, 'Ruth Lee Jia En', 'rlje2801@gmail.com', '', 'In-Between Animator (動画 / Douga)', 'animation', 'Portfolio: https://ruthleejiaen10.wixsite.com/portfolio/animation\r\n\r\nHi! I am Ruth. I specialise in 2D Animation and illustration. I am well-versed in the animation pipeline through my experience with various projects. \r\n\r\nI am genuinely excited for this opportunity to contribute my skills to your team :)  ', 'uploads/cvs/690c55e1b973d_RUTHLEEresume_anim.pdf', 'accepted', '2025-11-06 08:01:37', '2025-11-12 16:04:53'),
(92, 'Chloe Di Gemma', 'cdigemma@gmail.com', '', 'Finisher / Color Artist (仕上げ / Shiage)', 'color-design', 'My experience includes working on my own projects with line art cleanup, digital  final compositing to ensure each scene reflects the intended tone and mood of the project. I’m comfortable collaborating closely with animation and background teams.\r\n\r\nI’m always excited to contribute to projects that value craftsmanship and storytelling. I’d love the opportunity to bring my skills to your team and help enhance the quality of your productions.', 'uploads/cvs/690c68ae04766__Chloe_Di_Gemma_Animation_Resume_.pdf', 'declined', '2025-11-06 09:21:50', '2025-11-12 16:02:05'),
(93, 'Wren Ashton', 'wrennicht@outlook.com', '', 'In-Between Animator (動画 / Douga)', 'animation', 'I have just graudated from the University of Lincoln studying Animation and Visual Effects,  I recieved a 1st degree. I have a deep understanding of 2D Animation and have created a plethora of projects throughout my two years. I am very familiar with Clip Studio and other 2D animation software, I am also aware of the Japanese animation pipeline. I am a very detailed oriented person, which is why I would love to receive this opportunity. Below is a link to my portfolio where you can see some of my work, I update it regularly. \r\n\r\nhttps://www.artstation.com/wrenbl4nk', 'uploads/cvs/690c6e5b36fce_WrenAshtonCV.pdf', 'declined', '2025-11-06 09:46:03', '2025-11-12 16:00:55'),
(96, 'Quy Le', 'bonsama123@gmail.con', '', 'Key Animator (原画 / Genga)', 'animation', 'I’m a self taught 2D animator. This is my one year animation project. It’s all done by me in CSP Ex(rough being made in flash) https://x.com/bon_ql/status/1983436328923709454?s=46', NULL, 'accepted', '2025-11-06 10:19:07', '2025-11-12 16:00:22'),
(97, 'Darko Mitev', 'art@darkomitev.com', '', '3D Modeler (モデラー)', '3d-cgi', 'Hi all, I am passionate 3D modeler and CG Generalist with over 14 years of experience in the industry. I have experience in feature film, game cinematics, Commercials TV and VFX for companies like Axis Animations, Sunrise Animation, Alt VFX, Windmill Lane, Brownbag Films and many more. \r\n\r\nHere is my environment demo reel: https://www.youtube.com/watch?v=JRghGl0bpM8\r\n\r\nAnd here is my Character demo reel: \r\nhttps://www.youtube.com/watch?v=nch6oMzR4jw\r\n\r\nYou can also check out my website to see more of my work: https://www.darkomitev.com/\r\n\r\nI love anime and would be delighted to work with you guys!\r\n\r\nI hope you have a fantastic day!', 'uploads/cvs/690c9a7ff0d96_Darko_Mitev_CV_2025.pdf', 'accepted', '2025-11-06 12:54:23', '2025-11-12 15:58:50'),
(102, 'william vanderveer', 'wvanderveer99@gmail.com', '', 'In-Between Animator (動画 / Douga)', 'animation', 'I’m excited to apply for the In-Between Animator position at Vilo Studios. As a digital arts graduate with an Associate’s Degree in Graphic Design and experience creating 2D animation and illustration inspired by anime and video games, I’m eager to contribute my artistic skills to your animation team.\r\n\r\nDuring my studies, I developed a strong foundation in character movement, timing, and visual storytelling, using software such as Clip Studio Paint and Photoshop to bring expressive characters to life. My participation in SkillsUSA Nationals for 3D Animation & Visualization helped me refine my understanding of animation principles and teamwork under real production conditions. I take pride in my attention to detail and my ability to maintain consistency and fluidity between keyframes — skills that I know are essential for an in-between animator.\r\n\r\nI’m deeply inspired by anime’s expressive storytelling and would love the opportunity to grow under experienced animators at Vilo Studios. I’m confident my passion for dynamic motion, dedication to quality, and willingness to learn make me a great fit for your team.\r\n\r\nThank you for considering my application. I would be honored to help bring your studio’s projects to life. I look forward to the possibility of discussing how my skills and enthusiasm can contribute to your upcoming productions.\r\n\r\nhttps://williamvanderveerportfolio.godaddysites.com\r\n\r\nSincerely,\r\nBilly Vanderveer', 'uploads/cvs/690ce2a37180c_WilliamvanderveerResume.pdf', 'declined', '2025-11-06 18:02:11', '2025-11-12 15:57:49'),
(108, 'Derek Stepan', 'derek.stepan@yahoo.ca', '', 'Animation Director (作画監督/Sakkan)', 'animation', 'Hello,\r\n\r\nI have 5 years of professional animation experience both as an animator, Post Production Supervisor, and compositor. In that time, outside studio work, I’ve devoted my free moments into freelancing animation and working on animated short films using a complete production method based off the Japanese anime pipeline.\r\n\r\nIn my studio position I work as a 2D compositor using the Harmony and After Effects pipeline. As a compositor, I have been a lead in large projects like the Apple TV+ multi specials under the “Snoopy Presents” umbrella. Shows such as this series used both Harmony and After Effects for compositing and lighting. Other notable in-studio work I have had a chance to work on have either used Adobe Animate to After Effects workflow or a Harmony only workflow; as well as being a Post Production Supervisor, managing animatics and edits of episodes using Adobe Premier and DaVinci Resolve.\r\n\r\nRegarding my work in my spare time as a freelance animator, I am able to complete a one-man animation production from scratch for my clients. My production is based on Japanese anime pipelines but modified for a small team of one or two. The scope of my work as a freelancer includes—but not limited to—working in boards, traditional animation in the anime style, clean-up, colour, to final composite and edit. In short, my personal work are full productions where I have it look like anime that would be seen on streaming platforms or television.\r\n\r\nFor my personal and freelance work, my pipeline starts in Clip Studio Paint for storyboards, layout, and key animation. I use Cacani or Opentoonz for clean up, in-between, and colour. By the compositing phase, I use After Effects but recently have used Opentoonz for compositing since the tools and skills are transferrable from one to the other. Much of the magic to have that professional and polished look comes in the compositing phase. Specific LUTs, colour keying, and blending modes are necessary to create that distinct style seen in anime.\r\n\r\nUpon request, I can forward on any further details or testimonials. You can contact me by email at derek.stepan@yahoo.ca. You may find my demo reel at derekstepan.wixsite.com/portfolio/demo-reel  and you may more work I post on my LinkedIn at linkedin.com/in/derek-stepan-b7226519b/. My resume is attached. It would be a pleasure to discuss this opportunity further. Thank you for taking your time and consideration.\r\n\r\nSincerely,\r\n\r\nDerek Stepan', 'uploads/cvs/690d0cfe54745_Derek_Stepan_Resume_2025.pdf', 'declined', '2025-11-06 21:02:54', '2025-11-12 15:56:51'),
(110, 'Jeremy Yee', 'coachjeremydraws@gmail.com', '', 'Finisher / Color Artist (仕上げ / Shiage)', 'color-design', 'https://jeremyyee.myportfolio.com', 'uploads/cvs/690d88e5b2c7a_JeremyYeeresume2025.pdf', 'accepted', '2025-11-07 05:51:33', '2025-11-12 15:55:18'),
(117, 'Emmanuelle Cunningham', 'manicprice@gmail.com', '', 'Finisher / Color Artist (仕上げ / Shiage)', 'color-design', 'Hello! \r\n\r\nI saw on LinkedIn you’re looking to hire a color artist, and I would like to submit myself for consideration. I am currently working as a freelance artist and animator. I have experience across many different artistic disciplines that informs everything I do and will provide valuable insight into any challenges you put in front of me. Let me show you what I can do!\r\n\r\nI studied animation at the School of Visual Arts and earned my BFA and MFA in animation and computer art. These intensive art and computer courses have enabled me to execute work fast and efficiently, and I continue to take art courses from organizations such as Warrior Art Camp or Schoolism to make sure my skills are up to date. I have experience in drawing in traditional anime style thanks in part to the tutelage of Tokyo-based animators Jarrett Martin and Bellamy Brooks of Creative Freaks. \r\n\r\nI am proficient in CLIP STUDIO EX vs4 and Adobe Photoshop. I’ve learned programs such as Adobe Animate, After Effects, Illustrator, InDesign, Rush, Final Cut, Procreate, ToonBoom Harmony, Storyboard Pro, and other Mac and PC- based products. I recently had the honor and privilege to work on a team with Tourbox Tech and learned so much to enhance my workflow not just as an artist but as a professional animator. I was responsible for not only demonstrating the product but also teaching others the process while making sure everyone was fully engaged.\r\n\r\nI have developed a strong sense of organization with projects, practical interpersonal skills to meet deadlines, and the ability to contribute under pressure. With my background in animation, anime, character design, graphic design, and advertising, I am confident that I can make a profound contribution to your team.\r\n\r\nEnclosed is my resume for your review, as well as links to my portfolio website and LinkedIn page. I am enthusiastic about the position and look forward to meeting with you. Thank you for your time and consideration.\r\n\r\nSincerely,\r\nEmmanuelle Cunningham\r\n\r\nPortfolio Website:\r\nhttps://manitheuncanny.com/animation/\r\nhttps://manitheuncanny.com/anime/\r\n\r\nLinkedin:\r\nhttps://www.linkedin.com/in/emmanuellecunningham/\r\n\r\n', 'uploads/cvs/690e4b829a9c1_EmmanuelleCunninghamAnimationResume2025.pdf', 'accepted', '2025-11-07 19:41:54', '2025-11-12 15:53:09'),
(121, 'Samuel \"Zack\" Faux-Watkins', 'SamuelZWatBusiness@Gmail.com', '', 'In-Between Animator (動画 / Douga)', 'animation', 'https://xxzackattack27xx.carrd.co/', 'uploads/cvs/690ea7cd6be74_SamuelZackFaux-WatkinsResume202508-Augustv1.pdf', 'accepted', '2025-11-08 02:15:41', '2025-11-12 15:51:34'),
(125, 'Isaac Benavides Gonzalez', 'business@phlareox.art', '', 'Key Animator (原画 / Genga)', 'animation', 'Demo Reel: https://youtu.be/ONlN-PT4sHs\r\n\r\nSelf taught 2D artist based in Costa Rica with a deep passion for traditional animation.\r\n\r\nLearned animation through online courses from renowned animators such as Aaron Blaise. \r\n\r\nHave previously worked for a feature lenght film for Hierroanimacion from Colombia. \r\n\r\n\r\nProficient in Toon Boom Harmony, Clip Studio Paint and Adobe CC animation workflows.', 'uploads/cvs/690eb62db1673_IsaacBenavides-CV2Dv2-1.pdf', 'accepted', '2025-11-08 03:17:01', '2025-11-12 15:49:53'),
(126, 'Tennyson Guo', 'tennyson.guo@gmail.com', '', 'Character Designer', 'character-design', 'I’m a self-taught character designer currently enrolled in a Animation certification in Otis College of Art and Design with almost 10 years of drawing experience, including fan art, original character work, selling prints, and taking commissions. My 5 years in quality assurance have made me reliable, detail-focused, and deadline-oriented, and I’m excited to grow further in a studio role.\r\n\r\nPortfolio link: https://www.artstation.com/yamato_rekka_ben10', 'uploads/cvs/690ef580d08c6_TennysonG.2DArtistResume.docx', 'declined', '2025-11-08 07:47:12', '2025-11-12 15:48:58'),
(128, 'Jawaria ', 'jawariaazharhashmi@gmail.com', '', 'Finisher / Color Artist (仕上げ / Shiage)', 'character-design', 'https://jawariaazharhashmi.myportfolio.com/work\r\n\r\n\r\nProfessional character artist working in the industry since 10+ years. I have developed character art for comics, games and even for marketing purposes. \r\nMy experience also extends to cover art and designing table top games. \r\nI am constantly learning and evolving my art skills and I look forward to being able to in new roles such as animation.  \r\nI have never had the chance to work with an animation studio and have been eager to get into animation myself for a while. This opportunity excites me that I am able to find a doorway to animation industry and learn and contribute my skills to this project and studio. \r\n- Jack ', 'uploads/cvs/690fb3d9ef56e_Resume_JawariaHashmi.pdf', 'accepted', '2025-11-08 21:19:21', '2025-11-12 15:47:55'),
(129, 'Suree Yowell', 'suree.yowell@gmail.com', '', 'Animation Director (作画監督/Sakkan)', 'animation', 'I am also open to working on Second Key/Nigen and Genga, though most of my experience has been in corrections! A majority of my job at Powerhouse Animation was to model check our main character or revise keys for our overseas partners, and I was able to do some Sakkan on an upcoming HoYoFair project with ButaPro. My anime work can be seen in the NDA folder. Please access with the given password! \r\n\r\nhttps://www.sureeyowell.com/\r\n(NDA PW: !Access20Code25!', 'uploads/cvs/690fba153d4be_SureeYowell_Resume.pdf', 'accepted', '2025-11-08 21:45:57', '2025-11-12 15:46:47'),
(130, 'Rod Luper ', 'rod.luper1@gmail.com', '', 'Finisher / Color Artist (仕上げ / Shiage)', 'color-design', 'Hi,\r\nI’m Rod Luper, a Senior Concept Artist, Illustrator, and Storyboard Artist with over 20 years of experience in visual storytelling for games, animation, and comics.\r\nThroughout my career, I’ve collaborated with international studios such as Glu Mobile Games, Fuzzyeyes Ltd (Australia), Maya Labs, and Beyond Time Comics, creating concepts, storyboards, and illustrations that bring strong emotion and depth to characters and worlds.\r\nCareer Highlights:\r\nStoryboard Artist for animated projects and TV commercials, including campaigns such as Shell, where I developed visual storytelling from concept to final frame.\r\nConcept Artist on the game Bloody Glory (Glu Mobile), designing characters and environments in a medieval fantasy setting.\r\nArt Director at SkySoul (Australia) for IGG titles like Galaxy Online 02 and Sea Legend.\r\nIllustrator for Star Wars: Outlander, Dungeons & Dragons, and the Brazilian best-seller Angus.\r\nRecent freelance Concept Art for 1518 Studios and cover illustrations for Rippaverse Comics (USA).\r\nI’m passionate about developing visual narratives that blend strong design with storytelling clarity — whether through character concepts, environment design, or storyboards for animation and advertising.\r\nI’d love the opportunity to collaborate with Vilo Studios, contributing my experience to your creative team and helping craft engaging visual worlds for your productions.\r\n\r\nBest regards,\r\nRod Luper\r\nSenior Concept & Storyboard Artist\r\n📧 rod.luper1@gmail.com\r\nPortfolio:\r\n🎨 Character Concepts — https://drive.google.com/drive/folders/1-yvGI5vJ6_2f5dISSc4txL-Inw6gSTh-\r\n🌍 Environment Concepts — https://drive.google.com/drive/folders/1jKESXgUfCwcHW0JXq4o10TXCoz-rEq0g\r\n🌐 ArtStation Portfolio — rodluperuniverse.artstation.com\r\n\r\nThank you for your time and consideration.\r\nI’d be happy to discuss how my skills could contribute to your next project.\r\n', 'uploads/cvs/690fe747b2b44_RODLUPER-Resume-2025.pdf', 'accepted', '2025-11-09 00:58:47', '2025-11-12 15:45:44'),
(131, 'Murium Chishty ', 'murium.chishty@yahoo.com', '', 'Finisher / Color Artist (仕上げ / Shiage)', 'color-design', 'Dear VILOSTUDIOS Team,\r\n\r\nI am excited to apply for the Clean-up Artist role at your studio. My experience working on the student film \"Farwell\" by Liz Scott involved refining character and background elements to ensure visual consistency and polish. This has strengthened my skills in digital coloring, layer management, and attention to detail. Aling with my experience, my personal art style reflects my love for anime and all the intricate and amazing visual aspects of it. With this, along with my passion for anime, is something I could bring to your team. \r\n\r\nProficient in Photoshop, Clip-Studio Paint, and Medibang Pro, I am passionate about supporting animation pipelines and delivering high-quality work. You can view my portfolio at: https://sites.google.com/view/murium-c-/animation-projects\r\n\r\nThank you for your time and consideration. I look forward to the opportunity to contribute to your team!\r\n\r\nBest regards,  \r\nMurium Chishty  \r\nmurium.chishty@yahoo.com \r\n07867 384043 ', 'uploads/cvs/6910b8ce4bd6b_Murium_Chishty_Colour_Artist_CV.pdf', 'declined', '2025-11-09 15:52:46', '2025-11-12 15:44:54'),
(135, 'Mark Korneev', 'markkorneev@tuta.io', '', '3D Modeler (モデラー)', '3d-cgi', 'http://markkorneev.artstation.com/projects/ZlaDXG\r\nmarkkorneev.artstation.com', 'uploads/cvs/6911f7d8b71ac_Mark_Korneev_CV.pdf', 'accepted', '2025-11-10 14:34:00', '2025-11-12 15:41:33'),
(136, 'Aniyah Mehu', 'ANMehu_18@yahoo.com', '', 'Character Designer', 'character-design', 'https://shayzportfolio.carrd.co/', 'uploads/cvs/69120d5d3fa40_Resume_AniyahMehu.pdf', 'accepted', '2025-11-10 16:05:49', '2025-11-12 15:40:58'),
(138, 'JAMES BERNARD B. DEAN', 'jamesbernardbacalandean@gmail.com', '', 'Finisher / Color Artist (仕上げ / Shiage)', 'color-design', 'https://drive.google.com/file/d/1kENuMqMDrHq-ZHXdkooUs76zMDL7BwYk/view?usp=drive_link\r\n\r\nhttps://drive.google.com/drive/folders/1Jt-5DPWvsUfXuDb1mX0nmk-EVnuwHvPt?usp=drive_link', 'uploads/cvs/69127e8e40557_merged.pdf', 'accepted', '2025-11-11 00:08:46', '2025-11-12 15:40:01'),
(140, 'Soleil Hampton', 'soleilhampton@gmail.com', '', 'Rigger / Technical Artist (リガー / テクニカルアーティスト)', '3d-cgi', 'Github: https://github.com/airplanenoises/SoleilHampton\r\n\r\nRecent works: \r\nhttps://drive.google.com/drive/folders/1Wnayfp6BZwZrGnPPqFcHMgCfpg0yIQoB\r\n\r\nHey Vilo Studios Team!\r\n\r\nI’m really excited about the Technical Artist position — combining my love for anime with my experience in 2D/3D art, pipeline support, and tool creation makes this role especially exciting to me. I’ve always admired how anime balances expressive storytelling with precise craftsmanship, and that blend of artistry and structure is exactly what drives my work in technical art.\r\n\r\nHere’s a quick look at what I bring:\r\n	•	Experience with Maya, Blender, and Python scripting (including PySide6 GUIs) for building artist-facing tools, automating exports, and streamlining asset workflows\r\n	•	Solid understanding of animation principles and production pipelines\r\n	•	Comfortable collaborating with modelers and animators to troubleshoot technical issues and ensure smooth creative handoffs\r\n	•	Background in UI/UX design and 3D asset development, with an eye for efficiency, polish, and clear communication between art and tech teams\r\n	•	Deep passion for anime and stylized visuals — I’m eager to contribute to projects that bring that aesthetic to life\r\n\r\nI’d love the opportunity to chat more about how my technical experience and enthusiasm for anime production could support your team at Vilo Studios. Thanks so much for your time and consideration!\r\n\r\nBest,\r\nSoleil', 'uploads/cvs/6913e0aeef5cc_Soleil_Hampton_Resume.pdf', 'accepted', '2025-11-12 01:19:42', '2025-11-12 15:36:47'),
(142, 'Madhurima Das', 'maddy9815@gmail.com', '', 'In-Between Animator (動画 / Douga)', 'animation', 'Hello\r\n\r\nI came across the In-Between Animator position and immediately decided to apply and check my luck, hope my email finds its way to introduce myself to you. \r\n\r\nI am presently working as a freelance artist and have experience making animated videos and illustrations. I have been an animation intern at Bakarmax, worked for the YouTube channel Psych2Go where I crafted 2D animated videos on mental health and psychology. Additionally, I also worked as an animation assistant at Studio Bhaideas, for the Kafkaesque Ye Life music video and other projects.\r\n\r\nPFA my showreel, CV and website for your reference. Would love to work with you in any capacity possible and am looking forward to hearing back from you!    \r\n\r\nThanks\r\nMadhurima\r\n\r\nhttps://maddy9815.wixsite.com/madhurima-das', 'uploads/cvs/6915c3d903507_resume1.pdf', 'declined', '2025-11-13 11:41:13', '2025-11-15 11:34:57'),
(143, 'kevin Ravenell Jr', 'saitamasarg@gmail.com', '', 'Key Animator (原画 / Genga)', 'animation', 'Reel: \r\nhttps://www.youtube.com/watch?v=l7rF0ZY8-VU', 'uploads/cvs/69167132e2cfb_resumeupdated.pdf', 'accepted', '2025-11-14 00:00:50', '2025-11-15 11:35:43'),
(145, 'Nicholas Andre', 'viuki.work@gmail.com', '', '2D Concept artist', 'background-art', 'https://drive.google.com/file/d/1gXrxNU7kIDh3cuJhGvQ3kmQ4YJLnXtWx/view', 'uploads/cvs/6916928837cce_CV.NicholasA.pdf', 'declined', '2025-11-14 02:23:04', '2025-11-15 11:37:44'),
(147, 'Justin Ni', 'justinjni@gmail.com', '', 'In-Between Animator (動画 / Douga)', 'animation', 'My name is Justin Ni and I am an animator based in LA with experience in anime style productions. \r\n\r\nI am currently a key animator at the studio, Essence Cartoon, with a focus in creating expressive and dynamic character animation. In my role I work closely with the creative director and also provide animation notes to in-between artists.\r\n\r\nYou can find my portfolio at jniart.weebly.com\r\n\r\nI look forward to getting in touch!', 'uploads/cvs/6917b0e35aa9c_JustinNiAnimation2025Resume.pdf', 'accepted', '2025-11-14 22:44:51', '2025-11-15 11:42:41'),
(148, 'Connor Halleck', 'connor@halleck.com', '', 'In-Between Animator (動画 / Douga)', 'animation', 'https://www.connorhalleck.com/animation\r\n\r\nhttps://www.connorhalleck.com/productiondesign\r\n\r\npassword: paint', 'uploads/cvs/69192bea8eae7_ConnorHalleckCV.pdf', 'accepted', '2025-11-16 01:42:02', '2025-11-16 10:44:28'),
(149, 'Kellin Sproul', 'kellinsproul@zohomail.com', '', 'Key Animator (原画 / Genga)', 'animation', 'Hello there! My name is Kellin and I’m a passionate 2D genga animator with experience working as both a genga and douga animator as a freelance animator at Qzil.la. I’ve also worked on western indie projects as the 2D animation lead for over 2 years and have lots of knowledge working in collaborative environments as well as strong leadership skills. I’m well versed in with Clip Studio Paint as well as other industry standard software like ToonBoom Harmony. I’m super eager to join your animation team and hope to get to be a part of something amazing! ', 'uploads/cvs/691959bec455a_OpenArtistResume.pdf', 'accepted', '2025-11-16 04:57:34', '2025-11-16 10:49:43'),
(151, 'William Halbersma', 'gensopictures@gmail.com', '', 'In-Between Checker (動画検査 / Douga Kensa)', 'animation', 'Hi there,\r\n\r\nMy name is William Halbersma, an animator of many sorts. I heard you guys are looking for various production positions to fill and I happen to be available for work. I’ve been in the animation and art industry for over 20 years\r\n\r\nMy portfolio can be found at www.gensopictures.carbonmade.com\r\n\r\n\r\n', 'uploads/cvs/691aa827ef6bb_William_R_Halbersma_Resume.pdf', 'accepted', '2025-11-17 04:44:23', '2025-11-22 14:35:17'),
(156, 'humza khan ', 'humzaemail@gmail.com', '', 'Finisher / Color Artist (仕上げ / Shiage)', 'color-design', 'Hello, my name is Humza Khan. I am an illustrator concept artist.\r\n\r\nI wanted to reach out to you for potential future opportunities.\r\n\r\nYou can view my portfolio here:\r\n\r\nhttp://www.humzakhan.com\r\n\r\nThank you, have a great day.\r\n\r\n\r\nHumza A. Khan\r\nIllustrator & Concept Artist\r\n\r\nwebsite: www.humzakhan.com\r\ne-mail: humzaemail@gmail.com\r\nphone:248-762-2303', 'uploads/cvs/691bc2a6b0814_resume4.pdf', 'accepted', '2025-11-18 00:49:42', '2025-11-22 15:14:15'),
(157, 'Victor Bolo', 'victorbolo.oliveira@gmail.com', '', 'Key Animator (原画 / Genga)', 'animation', 'www.victorbolo.com', 'uploads/cvs/691bc453b6292_VictorBolo-Resume2024.pdf', 'accepted', '2025-11-18 00:56:51', '2025-11-22 15:20:31'),
(158, 'Adam Sherwin', 'komeryuu165@gmail.com', '', 'Finisher / Color Artist (仕上げ / Shiage)', 'color-design', 'Hi, I’m a 2D artist specializing in anime-style coloring and expressive character rendering.\r\nI’m applying for the Finisher / Color Artist (仕上げ) role. My strengths lie in digital painting, cel shading, and attention to detail when handling line art, lighting, and mood.\r\n\r\nI have extensive experience working in Clip Studio Paint and Photoshop with organized, production-friendly layers. My style is Japanese-influenced with a focus on strong color harmony and expressive emotion. I adapt quickly to new pipelines and am eager to gain professional experience in a studio environment.\r\n\r\nPortfolio: https://pixiv.me/komeryuu\r\nTwitter: x.com/@komeryuu165\r\n\r\nI’m based in the UK and fully available for remote freelance work.\r\n\r\nThank you very much for your time and consideration!', 'uploads/cvs/691e51f1444bf_AdamSherwinResume.pdf', 'accepted', '2025-11-19 23:25:37', '2025-11-22 15:42:13'),
(160, 'Victoria Plata Ramos ', 'vicplaram@gmail.com', '', 'In-Between Animator (動画 / Douga)', 'animation', 'https://vicplaram.wixsite.com/storyboard \r\n\r\nClean up https://youtu.be/-8cysMwyJAY?feature=shared', 'uploads/cvs/69217699839fc_IMG_0756_2.pdf', 'declined', '2025-11-22 08:38:49', '2025-11-22 15:45:53'),
(161, 'CARLOS YURY NUNES BARROSO', 'carlosyuryart@gmail.com', '', 'Key Animator (原画 / Genga)', 'animation', 'https://www.youtube.com/watch?v=QmT7U6SisS4&ab_channel=CarlosYury', 'uploads/cvs/6921ebe98f18c_Profile_CY.pdf', 'pending', '2025-11-22 16:59:21', NULL),
(162, 'CARLOS YURY NUNES BARROSO', 'carlosyuryart@gmail.com', '', 'In-Between Animator (動画 / Douga)', 'animation', 'https://www.youtube.com/watch?v=QmT7U6SisS4&ab_channel=CarlosYury', 'uploads/cvs/6921ec9c654c6_Profile_CY.pdf', 'pending', '2025-11-22 17:02:20', NULL),
(163, 'WILLIAN lieder', 'liederwillian@gmail.com', '', 'Finisher / Color Artist (仕上げ / Shiage)', 'color-design', 'https://drive.google.com/file/d/1Mbv_LoQoVXeuPtmYru14xLv2mU7zhQNL/view?usp=sharing', NULL, 'pending', '2025-11-22 17:48:51', NULL);
INSERT INTO `applications` (`id`, `name`, `email`, `phone`, `role`, `department`, `coverLetter`, `cv_path`, `status`, `submitted_at`, `processed_at`) VALUES
(164, 'Jakc Correnti', 'jacorrenti1@gmail.com', '', 'In-Between Animator (動画 / Douga)', 'animation', 'I\'ve followed Vilo Studios on Linkedin, and know I would make a good fit on your team as an in-between animator. I am a freelance 2D animator interested in working in anime and already have experience working in indie teams as a key animator, and in-betweening my own scenes. My roles have included in-between animation corrector, key animation and inbetweening, as well as a variety of roles in preproduction. I\'ve worked both on comedy and action animations, and draw in a variety of styles but feel most comfortable drawing the \"anime\" style. I am comfortable working with small teams, and am ready to step into larger productions. I pride myself with good communication and quality work. You can contact me at jacorrenti1@gmail.com or my number at (562)243-0609. I look forward to hearing back from you! ', 'uploads/cvs/6924d2ae97d3c_ack_Correnti_ViloStudios.docx.pdf', 'pending', '2025-11-24 21:48:30', NULL),
(165, 'Jack Correnti', 'animator@jackcorrenti.art', '', 'In-Between Animator (動画 / Douga)', 'animation', 'I\'ve followed Vilo Studios on Linkedin, and know I would make a good fit on your team as an in-betweener. I am a freelance 2D animator interested in working in anime and already have experience working in small indie teams as a key animator, and in between my own scenes. My roles have included in-between corrections, key animation and inbetweening, as well as a variety of roles in preproduction. I\'ve worked both on comedy and action animations, and draw in a variety of styles but feel most comfortable drawing the \"anime\" style. I am comfortable working with small teams and am ready to step into larger productions, I pride myself with good communication and quality work. \r\n\r\nHere is my demo reel https://jackcorrenti.art/portfolio/short-animation/. You can contact me through my portfolio site or at jacorrenti1@gmail.com or my number at (562)243-0609. I look forward to hearing back from you!', 'uploads/cvs/6925350ceae27_ack_Correnti_ViloStudios.docx.pdf', 'pending', '2025-11-25 04:48:12', NULL),
(166, 'Wesley Camara', 'wesleycamaraart@icloud.com', '', 'Finisher / Color Artist (仕上げ / Shiage)', 'color-design', 'Portfolio: https://wesleycamara.com\r\n\r\nDear Hiring Manager,\r\nI am writing to express my interest in the Colorist position. After reviewing the requirements, I believe that my qualifications and educational pursuits are a great fit for your studio.\r\nThroughout my previous work experiences, I\'ve honed my skills in design and painting, expanding my knowledge and passion for animation. My communication skills in English, Portuguese and French have defused countless tense situations, and I work effectively in high-pressure environments.\r\nI am self-motivated to complete tasks on time with minimal direction and I have strong time management skills. I am an energetic and enthusiastic team-player who can also step in to take the wheel when team leadership is needed.\r\nI would greatly appreciate your review of my enclosed resume and portfolio. I believe that I can be a valuable addition to your team. At your convenience, I am available for an interview for further discussion. I look forward to your response.\r\nSincerely,\r\nWesley Camara', 'uploads/cvs/692640e38d8a6_resume_wesleycamara.pdf', 'pending', '2025-11-25 23:50:59', NULL),
(167, 'Phantom_mb', 'phntmmb@gmail.com', '', 'Key Animator (原画 / Genga)', 'animation', 'I am a freelance animator with experience in LO (layout) and nigen / second key animation, and I have participated in multiple animation projects in these roles.\r\n\r\nI would really like to be able to do LO, but helping with production at Genga is also appreciated. \r\n\r\nI am highly motivated to contribute as a Key Animator (Genga) and continuously improve my skills within professional productions.\r\nBelow is my demo reel and portfolio:\r\n\r\nDemo Reel / Portfolio:  https://drive.google.com/drive/folders/1u1bnemtyy7c7trazTXdgKNIeZoJx5BPL?usp=drive_link ', 'uploads/cvs/69265c08e5e03_CVResume.pdf', 'pending', '2025-11-26 01:46:48', NULL),
(168, 'Jan Luke I. Pobre', 'janlukepobre@gmail.com', '', 'In-Between Animator (動画 / Douga)', 'animation', 'Jan Luke Pobre\r\n94-C, Road 3, Project 6, \r\nQuezon City,1100\r\n11/20/2025    \r\n\r\nDear Vilosutdios\r\nI am writing to express my interest in the animator position in Vilostudios. As a recent animation graduate, I feel excited about the opportunity that I can contribute to your studio known for producing animation on various projects. Your commitment to high quality animation makes me feel eager to learn and able to pursue this role. I am passionate about anime and have skills in developing in 2d animation. I am hardworking, creative, punctual, and eager to continue to learn. \r\nI believed my motivation and my artistic abilities will be able to align well with the needs of your team. I would be grateful for the opportunity to bring my talents and contribute to your projects. Please feel free to contact me at +639178654446. Below this is my attachment of my resume and portfolio.  \r\n\r\nAnimation Demo Reel:\r\nhttps://drive.google.com/drive/folders/1NH5ddEgtXwBKNAI-L79Ucx3uo2i8u0tN?usp=sharing \r\n\r\nArtStation Link: \r\nhttps://zypher.artstation.com/\r\n\r\nThank you for considering my application, I look forward to  the possibility of working with your team. \r\nSincerely, \r\nJan Luke Pobre\r\n\r\n', 'uploads/cvs/6928004b23ac6_ResumePobre.pdf', 'pending', '2025-11-27 07:39:55', NULL),
(169, 'Roberta Jackson', 'bobbi84th@yahoo.com', '', 'Voice actor', 'voice-acting', 'I\'m an American female voice actor in animation, games, audio dramas, podcasts and audiobooks. Audio samples and more information are on my website:  https://www.robertajackson.com/', 'uploads/cvs/6929f57c3c5bf_RobertaJackson-Voiceworkresume.pdf', 'pending', '2025-11-28 19:18:20', NULL),
(170, 'Miles Lara', 'mmpl.contact@gmail.com', '', 'In-Between Animator (動画 / Douga)', 'animation', 'As an animation graduate, I’m very interested of gaining more experience in the field! I did in between work in both college and in the animation section of a live action work. I’ll send a link of both my reel and my drawing portfolio, if my art style is of any interested for any other position in the company.\r\nI’m looking forward of hearing your respond.\r\n\r\nhttps://drive.google.com/file/d/1eyyBO7TFAfjTVQKURuE6iOg_bJMo0v_B/view?usp=drivesdk\r\n\r\nhttps://mmpl.carrd.co/#portfolio', 'uploads/cvs/692a1bee33450_CV_MilesLara.pdf', 'pending', '2025-11-28 22:02:22', NULL),
(171, 'Ivan Marcos Candeleda', 'birdhood.animation.art@gmail.com', '', 'Key Animator (原画 / Genga)', 'animation', 'My background includes professional 2D animation, concept art, and clean-up for studios such as Kaika Agency including an animation showcased in Times Square as well as projects for Codexittemedia and a variety of independent clients. I’ve also collaborated with IKHOR in the artistic development and testing of Kamik.ai, an innovative hybrid animation software that combines frame-by-frame techniques with AI tools for anime style workflows. This experience strengthened my adaptability and technical understanding of modern pipelines.\r\n\r\nI specialize in expressive character animation, solid timing, clean linework, and visually engaging motion. Whether working in Toon Boom Harmony, Clip Studio, Adobe Animate, or traditional workflows, I focus on delivering polished, appealing, and story driven animation that fits the tone and energy of each project.\r\n\r\nAnimations:\r\n\r\n 2D Shortfilm\r\nhttps://drive.google.com/file/d/12S8ryEsonPbRs4P3X8egMDxipgLnJjgc/view?usp=drivesdk\r\n\r\nAnime Portfolio:\r\n(https://drive.google.com/file/d/1qBRL5I349kowOIZV_mm0Q_-T11Fvpw3Q/view?usp=drive_link)\r\n\r\n2D Animation reel\r\n(https://www.artstation.com/artwork/aozOGq)\r\n\r\nCharacter Desing, Digital Art and Animations (general portfolio):\r\n\r\nSamurai Girl\r\nhttps://www.artstation.com/artwork/KeXYB9\r\nChamana \r\nhttps://www.artstation.com/artwork/PXlRr3\r\nAnime concept\r\nhttps://www.artstation.com/artwork/JvxvKn\r\nhttps://www.artstation.com/artwork/dKZd3J\r\nhttps://www.artstation.com/artwork/PXQnOL\r\nhttps://www.artstation.com/artwork/Za8zW0\r\nhttps://www.artstation.com/artwork/Xgr2By\r\n\r\nGeneral Portfolio\r\nhttps://www.artstation.com/birdhood \r\n\r\nSocial Medias:\r\n\r\nhttps://www.linkedin.com/in/ivanbirdhood\r\n\r\n', 'uploads/cvs/693030dad23e3_CVAnimatorversion2English3.pdf', 'pending', '2025-12-03 12:45:14', NULL),
(172, 'Ivan Marcos Candeleda', 'birdhood.animation.art@gmail.com', '', 'In-Between Animator (動画 / Douga)', 'animation', 'My background includes professional 2D animation, concept art, and clean-up for studios such as Kaika Agency including an animation showcased in Times Square as well as projects for Codexittemedia and a variety of independent clients. I’ve also collaborated with IKHOR in the artistic development and testing of Kamik.ai, an innovative hybrid animation software that combines frame-by-frame techniques with AI tools for anime style workflows. This experience strengthened my adaptability and technical understanding of modern pipelines.\r\n\r\nI specialize in expressive character animation, solid timing, clean linework, and visually engaging motion. Whether working in Toon Boom Harmony, Clip Studio, Adobe Animate, or traditional workflows, I focus on delivering polished, appealing, and story driven animation that fits the tone and energy of each project.\r\n\r\nAnimations:\r\n\r\n 2D Shortfilm\r\nhttps://drive.google.com/file/d/12S8ryEsonPbRs4P3X8egMDxipgLnJjgc/view?usp=drivesdk\r\n\r\nAnime Portfolio:\r\n(https://drive.google.com/file/d/1qBRL5I349kowOIZV_mm0Q_-T11Fvpw3Q/view?usp=drive_link)\r\n\r\n2D Animation reel\r\n(https://www.artstation.com/artwork/aozOGq)\r\n\r\nCharacter Desing, Digital Art and Animations (general portfolio):\r\n\r\nSamurai Girl\r\nhttps://www.artstation.com/artwork/KeXYB9\r\nChamana \r\nhttps://www.artstation.com/artwork/PXlRr3\r\nAnime concept\r\nhttps://www.artstation.com/artwork/JvxvKn\r\nhttps://www.artstation.com/artwork/dKZd3J\r\nhttps://www.artstation.com/artwork/PXQnOL\r\nhttps://www.artstation.com/artwork/Za8zW0\r\nhttps://www.artstation.com/artwork/Xgr2By\r\n\r\nGeneral Portfolio\r\nhttps://www.artstation.com/birdhood \r\n\r\nSocial Medias:\r\n\r\nhttps://www.linkedin.com/in/ivanbirdhood\r\n', 'uploads/cvs/693030f9cbc70_CVAnimatorversion2English3.pdf', 'pending', '2025-12-03 12:45:45', NULL),
(173, 'Cao Tri Anthony Truong Dinh', 'ctatd05@gmail.com', '', 'In-Between Animator (動画 / Douga)', 'animation', 'My name is Cao Tri Anthony Truong Dinh. I go by Anthony, and I\'m a Junior at Pacific Northwest College of Art, majoring in Animated Arts. I am inspired by manga, anime, and video games. I want to work in Anime Production as an Animator (アニメーター).\r\n\r\nPortfolio Link: https://drive.google.com/drive/u/1/folders/1MDI8NHTEywgGT7-gMxxcPGzGSUvlRvUY ', 'uploads/cvs/69309b298bbb3_Anthony_TruongDinh_Resume_CV.pdf', 'pending', '2025-12-03 20:18:49', NULL),
(174, 'Julia Alves de Oliveira', 'juliaalvessnake@gmail.com', '', 'In-Between Animator (動画 / Douga)', 'animation', 'https://juliaalvessnake.wixsite.com/portifolio-julia-alv\r\n\r\nHello! I\'m Julia Alves and I\'m 25, looking to get into the anime industry.\r\nA friend recommended your studio to me while I’ve been looking into branching out to other animation fields. I\'ve completed big personal animation projects in recent years and understand how things work in the western side of animation production, recently working at a western indie studio as well. Though I’ve only seen professionals at the douga style and process of animation explaining how their job works, I’m a fast learner and know how to adapt to technical changes and know my way through animation and have a good idea how this style of production goes. I’m committed to put my skills into the job and make sure clients have the best results at the end.Hope you like what you see and consider hiring me\r\n\r\nThank you for your time\r\nJulia ', 'uploads/cvs/6935e90658e69_JuliaAlvesResume.pdf', 'pending', '2025-12-07 20:52:22', NULL),
(175, 'NUR AMIELA AZNEEN JAMALUDIN', 'amielaazneen@yahoo.com', '', 'In-Between Animator (動画 / Douga)', 'animation', 'Hello good day 👋  My name is Milla and I\'m from Malaysia. I\'ve worked in anime production for nearly 2 years now and I am currently freelancing. I am very interested to apply for the Douga position in Vilo Studios. I am also able to do Shiage as well as Nigen and although not so experienced, Genga. \r\n\r\nHere is my portfolio: https://nefelielsamerlyn.my.canva.site/art-portfolio-nur-amiela \r\n\r\nDo let me know if you need to know any additional information! You may reach me out at my email amielaazneen@gmail.com or at my discord at @choizechexicano 🫶 Hope to hear from you soon!\r\n\r\n((I am not sure if the application went through before this I am sorry if I accidentally submit multiple of them😭)) ', 'uploads/cvs/6936de128ce6a_NURAMIELAAZNEENRESUME2025.pdf', 'pending', '2025-12-08 14:17:54', NULL),
(176, 'matthew Mai', 'matthewmai146@gmail.com', '', 'In-Between Animator (動画 / Douga)', 'animation', 'My name is Matthew Mai, and I have professional experience working as an in-between animator, 2nd key animator, and cleanup artist across multiple anime studios. I specialize in producing clean, consistent in-betweens (動画) that respect the timing, spacing, and character acting established by the key animator.\r\n\r\nRelevant Experience (from my resume)\r\n\r\nStudio Eclipse – 2nd Key Animator (Nov–Dec 2024):\r\nAdded in-betweens, refined key frames, matched line quality, and maintained character consistency.\r\n\r\nThe Fisherman’s Lullaby – Clean-up / 2nd Key (2025):\r\nAdded 動画 frames and cleaned up genga-level character drawings.\r\n\r\nTatsunoko Production (2025–Current):\r\nProduced hand-drawn animation, key frames, in-betweens, and special effects cuts.\r\n\r\nCreative Antacid & Qzil.la – Rough & Layout Animation:\r\nUnderstanding of spacing, timing, and maintaining flow from rough to final animation.\r\n\r\nSkills for the Douga Role\r\n\r\nStrong, clean linework suitable for Japanese-style 動画.\r\n\r\nAbility to maintain model accuracy between key frames.\r\n\r\nExperienced with Clip Studio Paint (CSP), Toon Boom Harmony, and traditional timing workflows.\r\n\r\nFamiliarity with Japanese timing sheets (タイムシート) and correction notes.\r\n\r\nQuick, precise revisions and excellent remote communication.\r\n\r\nI enjoy the discipline, precision, and teamwork involved in 動画 and take pride in supporting the overall final quality of each cut.\r\n', 'uploads/cvs/693786732b7c6_MATTHEW_MAI_Resumeupdatesep11.pdf', 'pending', '2025-12-09 02:16:19', NULL),
(177, 'matthew Mai', 'matthewmai146@gmail.com', '', 'Key Animator (原画 / Genga)', 'animation', 'My name is Matthew Mai, and I am a key animator with experience creating expressive key poses (原画), refining character acting, and ensuring on-model performance. My background across layout, genga correction, and sakkan assistance gives me a deep understanding of quality control and character consistency.\r\n\r\nRelevant Experience (from my resume)\r\n\r\nCloverWorks – Art Director Correction (2025):\r\nCorrected character model animation and fixed inconsistent character designs.\r\n\r\nTokyo Creative Freak – Art Director Assistant (Sakkan, 2025):\r\nCorrected key animation, layout, and character models while providing notes and guidance.\r\n\r\nTatsunoko Production – Animator (2025–Current):\r\nDesigned keyframes, in-betweens, and FX animation; created storyboards and animatics.\r\n\r\nStudio Eclipse – 2nd Key Animator:\r\nProduced refined key frames and supported primary 原画 cuts.\r\n\r\nMultiple studios – Layout Animator roles:\r\nStrong foundation in perspective, acting, and pose clarity.\r\n\r\nSkills for the Genga Role\r\n\r\nAbility to interpret storyboards and layouts into strong, clear key poses.\r\n\r\nConfident drawing fundamentals: anatomy, gesture, line control.\r\n\r\nExperience with correction processes and understanding notes from 作監.\r\n\r\nStrong background in layout → rough → key → cleanup flow.\r\n\r\nFluent use of Clip Studio Paint for modern digital 原画 workflows.\r\n\r\nReliable communication in remote settings and efficient feedback incorporation.\r\n\r\nI aim to create animation that enhances character performance, supports the storytelling, and contributes meaningfully to each cut.', 'uploads/cvs/69378678e29d2_MATTHEW_MAI_Resumeupdatesep11.pdf', 'pending', '2025-12-09 02:16:24', NULL),
(178, 'Janet Mah', 'jleemah128@gmai.com', '', 'Key Animator (原画 / Genga)', 'animation', 'I am thrilled to apply for the Key Animator for Vilo Studios, as I have long admired your commitment to storytelling and technical excellence in animation. The opportunity to work on diverse projects and bring characters to life in such a renowned company aligns perfectly with my passion for creating compelling animations that captivate and inspire audiences. Framestore\'s emphasis on collaboration and innovation resonates with my artistic vision and my dedication to pushing the boundaries of visual storytelling.\r\nWith extensive experience in 2D animation and coordination, I am well-prepared to contribute effectively to your team. During my tenure at Buggie, I translated creative directions into engaging animations, while ensuring efficient project workflows. Similarly, as an Animation Director for freelance projects, I collaborated closely with technical directors to enhance animation quality, a skill crucial for managing both primary and secondary elements in line with your job description. My proficiency in Toon Boom Harmony, Blender, Maya, and Adobe Suite, along with a strong track record of effective communication and problem-solving, ensures I will thrive in fast-paced and dynamic environments like yours.\r\n\r\nYou can find my portfolio here: https://janetmahart.com\r\n', 'uploads/cvs/693b33f2df4b8_JanetLeeMah-20252DAnimationResume.pdf', 'pending', '2025-12-11 21:13:22', NULL),
(179, 'Janet Mah', 'jleemah128@gmail.com', '', 'In-Between Animator (動画 / Douga)', 'animation', 'I am thrilled to apply for the In-Between position at Vilo Studios, as I have long admired your commitment to storytelling and technical excellence in animation. The opportunity to work on diverse projects and bring characters to life in such a renowned company aligns perfectly with my passion for creating compelling animations that captivate and inspire audiences. Framestore\'s emphasis on collaboration and innovation resonates with my artistic vision and my dedication to pushing the boundaries of visual storytelling.\r\nWith extensive experience in 2D animation and coordination, I am well-prepared to contribute effectively to your team. During my tenure at Buggie, I translated creative directions into engaging animations, while ensuring efficient project workflows. Similarly, as an Animation Director for freelance projects, I collaborated closely with technical directors to enhance animation quality, a skill crucial for managing both primary and secondary elements in line with your job description. My proficiency in Toon Boom Harmony, Blender, Maya, and Adobe Suite, along with a strong track record of effective communication and problem-solving, ensures I will thrive in fast-paced and dynamic environments like yours.\r\n\r\nYou can find my portfolio/website here: https://janetmahart.com\r\n', 'uploads/cvs/693b346d6d253_JanetLeeMah-20252DAnimationResume.pdf', 'pending', '2025-12-11 21:15:25', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `freelancers`
--

CREATE TABLE `freelancers` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `department` varchar(100) NOT NULL,
  `roles` text NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `departments` text NOT NULL COMMENT 'Comma-separated list of departments'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `freelancers`
--

INSERT INTO `freelancers` (`id`, `name`, `department`, `roles`, `created_at`, `updated_at`, `departments`) VALUES
(1, 'Kevin MD', 'production', 'Anime Producer, Audio Director', '2025-10-22 08:05:17', '2025-10-24 14:59:45', 'production,sound-design'),
(4, 'HeyNight', 'animation', 'Key Animator (Genga)', '2025-10-22 11:14:47', '2025-10-24 14:43:04', 'animation'),
(5, 'samuido', 'editing', 'After Effects (MV)', '2025-10-22 11:28:45', '2025-10-24 14:43:04', 'editing'),
(6, 'thedjkim', 'music', 'Arranger', '2025-10-22 11:29:09', '2025-10-24 14:43:04', 'music'),
(7, 'ddavi', 'character-design', 'Concept Artist', '2025-10-22 11:29:43', '2025-10-24 14:43:04', 'character-design'),
(8, 'cecilia', 'character-design', 'Concept Artist', '2025-10-22 11:31:05', '2025-10-24 14:43:04', 'character-design'),
(9, 'samael', 'production', 'Production Management', '2025-10-22 11:31:38', '2025-10-24 14:43:04', 'production'),
(10, 'Justin', 'animation', 'LO Animation', '2025-10-22 11:32:12', '2025-10-24 14:43:04', 'animation'),
(11, 'Trickle', 'music', 'Utaite', '2025-10-22 11:32:33', '2025-10-24 14:43:04', 'music'),
(12, 'Riccardo Salin', 'sound-design', 'Sound Designer, Foley Artist', '2025-10-22 11:32:55', '2025-10-24 14:43:04', 'sound-design'),
(13, 'Animecio', 'music', 'Arranger', '2025-10-22 11:33:19', '2025-10-24 14:43:04', 'music'),
(14, 'Alex Ross', 'voice-acting', 'Voice Actor [M]', '2025-10-22 11:33:48', '2025-10-24 14:43:04', 'voice-acting'),
(15, 'Mike Cunningham', 'voice-acting', 'Voice Actor [M]', '2025-10-22 11:34:11', '2025-10-24 14:43:04', 'voice-acting'),
(16, 'Flyingraffa', 'music', 'Composer', '2025-10-22 11:34:41', '2025-10-24 14:43:04', 'music'),
(17, 'Kikoo', 'animation', 'Douga, Satsuei Kantoku, Illustrator', '2025-10-22 11:35:33', '2025-10-24 14:43:04', 'animation'),
(19, 'Hoka', 'animation', 'Douga', '2025-10-22 11:36:16', '2025-10-24 14:43:04', 'animation'),
(20, 'Andeen', 'animation', 'Douga', '2025-10-22 11:36:25', '2025-10-24 14:43:04', 'animation'),
(21, 'NotWeabo', 'animation', 'Douga', '2025-10-22 11:36:38', '2025-10-24 14:43:04', 'animation'),
(22, 'CLNDSTN', 'animation', 'Sakkan', '2025-10-22 11:37:21', '2025-10-24 14:43:04', 'animation'),
(24, 'ActualyZack', 'photography-compositing', 'Compositor', '2025-10-22 11:38:07', '2025-10-24 14:43:04', 'photography-compositing'),
(25, 'valerie.tata', 'photography-compositing', 'Compositor', '2025-10-22 11:38:21', '2025-10-24 14:43:04', 'photography-compositing'),
(26, 'wg', 'animation', 'Genga', '2025-10-22 11:38:34', '2025-10-24 14:43:04', 'animation'),
(27, 'Levii', 'animation', 'Genga', '2025-10-22 11:38:44', '2025-10-24 14:43:04', 'animation'),
(28, 'TOGONAI', 'animation', 'Genga', '2025-10-22 11:38:55', '2025-10-24 14:43:04', 'animation'),
(29, 'Kaynunu', 'animation', 'Douga, Genga', '2025-10-22 11:39:10', '2025-10-24 14:43:04', 'animation'),
(30, 'ohayow_des', 'animation', 'Genga', '2025-10-22 11:39:22', '2025-10-24 14:43:04', 'animation'),
(31, 'Nikolay', 'animation', 'Genga, Douga', '2025-10-22 11:39:37', '2025-10-24 14:43:04', 'animation'),
(32, 'Imahty', 'background-art', 'Background Artist (2D)', '2025-10-22 11:39:59', '2025-10-24 14:43:04', 'background-art'),
(35, 'Asly', '3d-cgi', '3D Previsual', '2025-10-22 11:40:58', '2025-10-24 14:43:04', '3d-cgi'),
(36, 'Oesman', '3d-cgi', 'Background Artist (3D)', '2025-10-22 11:41:40', '2025-10-24 14:43:04', '3d-cgi'),
(37, 'ronnn', 'editing', 'Editor', '2025-10-22 11:42:40', '2025-10-24 14:43:04', 'editing'),
(38, 'ririn', 'animation', 'Douga, Shiage', '2025-10-22 11:43:58', '2025-10-24 14:43:04', 'animation'),
(39, 'purplev', 'background-art', 'Background Artist (2D)', '2025-10-22 11:44:46', '2025-10-24 14:43:04', 'background-art'),
(40, 'MAX HERZFELD', 'voice-acting', 'Voice Actor [M]', '2025-10-22 11:47:45', '2025-10-24 14:43:04', 'voice-acting'),
(41, 'iShade', 'editing', 'After Effects (MV)', '2025-10-22 11:48:31', '2025-10-24 14:43:04', 'editing'),
(42, 'Christopher Caz', 'voice-acting', 'Voice Actor [M]', '2025-10-22 11:49:11', '2025-10-24 14:43:04', 'voice-acting'),
(43, 'Facu Escobedo', 'animation', 'Sakkan', '2025-10-22 11:50:13', '2025-10-24 14:43:04', 'animation'),
(44, 'Kritika', 'background-art', 'Background Artist (2D)', '2025-10-22 11:55:26', '2025-10-24 14:43:04', 'background-art'),
(45, 'shishishiena', 'music', 'Utaite [F]', '2025-10-22 11:56:46', '2025-10-24 14:43:04', 'music'),
(47, 'Taqi Falsafi', 'production', 'Animation Director, Project Director', '2025-10-24 14:19:37', '2025-10-24 14:43:04', 'production'),
(49, 'Wonder', '', '', '2025-10-28 16:11:27', '2025-10-28 16:11:27', ''),
(50, 'Matthew Mai ', 'animation', 'Animation Director (作画監督/Sakkan)', '2025-10-28 16:17:22', '2025-10-28 16:17:22', ''),
(51, '凯文', '', '', '2025-10-31 15:18:12', '2025-10-31 15:21:43', ''),
(52, 'Soleil Hampton', '3d-cgi', 'Rigger / Technical Artist (リガー / テクニカルアーティスト)', '2025-11-12 15:36:47', '2025-11-12 15:36:47', ''),
(53, 'JAMES BERNARD B. DEAN', 'color-design', 'Finisher / Color Artist (仕上げ / Shiage)', '2025-11-12 15:40:01', '2025-11-12 15:40:01', ''),
(54, 'Aniyah Mehu', 'character-design', 'Character Designer', '2025-11-12 15:40:58', '2025-11-12 15:40:58', ''),
(55, 'Mark Korneev', '3d-cgi', '3D Modeler (モデラー)', '2025-11-12 15:41:33', '2025-11-12 15:41:33', ''),
(56, 'Rod Luper ', 'color-design', 'Finisher / Color Artist (仕上げ / Shiage)', '2025-11-12 15:45:44', '2025-11-12 15:45:44', ''),
(57, 'Suree Yowell', 'animation', 'Animation Director (作画監督/Sakkan)', '2025-11-12 15:46:47', '2025-11-12 15:46:47', ''),
(58, 'Jawaria ', 'character-design', 'Finisher / Color Artist (仕上げ / Shiage)', '2025-11-12 15:47:55', '2025-11-12 15:47:55', ''),
(59, 'Isaac Benavides Gonzalez', 'animation', 'Key Animator (原画 / Genga)', '2025-11-12 15:49:53', '2025-11-12 15:49:53', ''),
(60, 'Samuel \"Zack\" Faux-Watkins', 'animation', 'In-Between Animator (動画 / Douga)', '2025-11-12 15:51:34', '2025-11-12 15:51:34', ''),
(61, 'Emmanuelle Cunningham', 'color-design', 'Finisher / Color Artist (仕上げ / Shiage)', '2025-11-12 15:53:09', '2025-11-12 15:53:09', ''),
(62, 'Jeremy Yee', 'color-design', 'Finisher / Color Artist (仕上げ / Shiage)', '2025-11-12 15:55:18', '2025-11-12 15:55:18', ''),
(63, 'Darko Mitev', '3d-cgi', '3D Modeler (モデラー)', '2025-11-12 15:58:50', '2025-11-12 15:58:50', ''),
(64, 'Quy Le', 'animation', 'Key Animator (原画 / Genga)', '2025-11-12 16:00:22', '2025-11-12 16:00:22', ''),
(65, 'Ruth Lee Jia En', 'animation', 'In-Between Animator (動画 / Douga)', '2025-11-12 16:04:53', '2025-11-12 16:04:53', ''),
(66, 'Andrea Preciado', '3d-cgi', 'CG Animator (CGアニメーター)', '2025-11-12 16:06:22', '2025-11-12 16:06:22', ''),
(67, 'Kaylon M Membreno', 'color-design', 'Finisher / Color Artist (仕上げ / Shiage)', '2025-11-12 16:06:36', '2025-11-12 16:06:36', ''),
(68, 'Arturo Angelo Frio', 'character-design', 'Character Concept Artist', '2025-11-12 16:07:41', '2025-11-12 16:07:41', ''),
(69, 'Lydia Philips', 'color-design', 'Finisher / Color Artist (仕上げ / Shiage)', '2025-11-12 16:08:20', '2025-11-12 16:08:20', ''),
(70, 'Alex Hidalgo ', 'color-design', 'Finisher / Color Artist (仕上げ / Shiage)', '2025-11-12 16:09:25', '2025-11-12 16:09:25', ''),
(71, 'Jonathan Aguillon', 'character-design', 'Concept artist', '2025-11-12 16:09:55', '2025-11-12 16:09:55', ''),
(72, 'Kimberly Gouge', 'animation', 'In-Between Animator (動画 / Douga)', '2025-11-12 16:10:20', '2025-11-12 16:10:20', ''),
(73, 'Paul Pislea', '3d-cgi', '3D Artist Generalist', '2025-11-12 16:13:43', '2025-11-12 16:13:43', ''),
(74, 'Brian Yuen', 'character-design', '2D concept artist/ character designer/ 2D background painter', '2025-11-12 16:14:11', '2025-11-12 16:14:11', ''),
(75, 'Tuyen Ngo', 'character-design', 'Character Designer, Illustrator', '2025-11-12 16:14:55', '2025-11-12 16:14:55', ''),
(76, 'Deborah Balboa', 'color-design', 'Finisher / Color Artist (仕上げ / Shiage)', '2025-11-12 16:15:44', '2025-11-12 16:15:44', ''),
(77, 'Raul Ortiz Campillo', 'animation', 'Key Animator (原画 / Genga)', '2025-11-12 16:17:48', '2025-11-12 16:17:48', ''),
(78, 'Ryanne Angeli Emmanuelle Yana', 'character-design', 'Concept Artist', '2025-11-12 16:18:25', '2025-11-12 16:18:25', ''),
(79, 'Yuanli', '3d-cgi', '3D Modeler (モデラー)', '2025-11-12 16:24:38', '2025-11-12 16:24:38', ''),
(80, 'Rebeca Espindola Recoder', 'animation', 'In-Between Animator (動画 / Douga)', '2025-11-12 16:27:06', '2025-11-12 16:27:06', ''),
(81, 'Ghita Hsaine', '3d-cgi', 'CG Animator (CGアニメーター)', '2025-11-12 16:27:33', '2025-11-12 16:27:33', ''),
(82, 'Mohanad Ahmed', 'animation', 'In-Between Animator (動画 / Douga)', '2025-11-12 16:27:44', '2025-11-12 16:27:44', ''),
(83, 'Gabrielle Demarigny', 'color-design', 'Finisher / Color Artist (仕上げ / Shiage)', '2025-11-12 16:28:55', '2025-11-12 16:28:55', ''),
(84, 'Enrico Antonio Primo Patucci', '3d-cgi', 'CG Animator (CGアニメーター)', '2025-11-12 16:30:26', '2025-11-12 16:30:26', ''),
(85, 'solomon geri', 'animation', 'Key Animator (原画 / Genga)', '2025-11-12 16:31:02', '2025-11-12 16:31:02', ''),
(86, 'Kayla Stith', 'animation', 'In-Between Animator (動画 / Douga)', '2025-11-12 16:32:03', '2025-11-12 16:32:03', ''),
(87, 'Akeem Clarke', 'animation', 'Key Animator (原画 / Genga)', '2025-11-12 16:34:47', '2025-11-12 16:34:47', ''),
(88, 'Thomas Winn', 'animation', 'Key Animator (原画 / Genga)', '2025-11-12 16:35:32', '2025-11-12 16:35:32', ''),
(89, 'Mrunal Khairnar', 'animation', 'In-Between Animator (動画 / Douga)', '2025-11-12 16:39:23', '2025-11-12 16:39:23', ''),
(90, 'Ardie Walton', 'animation', 'In-Between Animator (動画 / Douga)', '2025-11-12 16:41:14', '2025-11-12 16:41:14', ''),
(91, 'kevin Ravenell Jr', 'animation', 'Key Animator (原画 / Genga)', '2025-11-15 11:35:43', '2025-11-15 11:35:43', ''),
(92, 'Nicholas Andre', 'background-art', '2D Concept artist', '2025-11-15 11:36:58', '2025-11-15 11:36:58', ''),
(93, 'Justin Ni', 'animation', 'In-Between Animator (動画 / Douga)', '2025-11-15 11:42:41', '2025-11-15 11:42:41', ''),
(94, 'Connor Halleck', 'animation', 'In-Between Animator (動画 / Douga)', '2025-11-16 10:44:28', '2025-11-16 10:44:28', ''),
(95, 'Kellin Sproul', 'animation', 'Key Animator (原画 / Genga)', '2025-11-16 10:49:43', '2025-11-16 10:49:43', ''),
(96, 'William Halbersma', 'animation', 'In-Between Checker (動画検査 / Douga Kensa)', '2025-11-22 14:35:17', '2025-11-22 14:35:17', ''),
(97, 'humza khan ', 'color-design', 'Finisher / Color Artist (仕上げ / Shiage)', '2025-11-22 15:14:15', '2025-11-22 15:14:15', ''),
(98, 'Victor Bolo', 'animation', 'Key Animator (原画 / Genga)', '2025-11-22 15:20:31', '2025-11-22 15:20:31', ''),
(99, 'Adam Sherwin', 'color-design', 'Finisher / Color Artist (仕上げ / Shiage)', '2025-11-22 15:42:13', '2025-11-22 15:42:13', '');

-- --------------------------------------------------------

--
-- Table structure for table `freelancer_departments`
--

CREATE TABLE `freelancer_departments` (
  `id` int(11) NOT NULL,
  `freelancer_id` int(11) NOT NULL,
  `department` varchar(100) NOT NULL,
  `roles` text NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `freelancer_departments`
--

INSERT INTO `freelancer_departments` (`id`, `freelancer_id`, `department`, `roles`, `created_at`, `updated_at`) VALUES
(2, 4, 'animation', 'Key Animator (Genga)', '2025-10-24 15:07:59', '2025-10-24 15:07:59'),
(3, 5, 'editing', 'After Effects (MV)', '2025-10-24 15:07:59', '2025-10-24 15:07:59'),
(4, 6, 'music', 'Arranger', '2025-10-24 15:07:59', '2025-10-24 15:07:59'),
(5, 7, 'character-design', 'Concept Artist', '2025-10-24 15:07:59', '2025-10-24 15:07:59'),
(6, 8, 'character-design', 'Concept Artist', '2025-10-24 15:07:59', '2025-10-24 15:07:59'),
(7, 9, 'production', 'Production Management', '2025-10-24 15:07:59', '2025-10-24 15:07:59'),
(8, 10, 'animation', 'LO Animation', '2025-10-24 15:07:59', '2025-10-24 15:07:59'),
(10, 12, 'sound-design', 'Sound Designer, Foley Artist', '2025-10-24 15:07:59', '2025-10-24 15:07:59'),
(11, 13, 'music', 'Arranger', '2025-10-24 15:07:59', '2025-10-24 15:07:59'),
(12, 14, 'voice-acting', 'Voice Actor [M]', '2025-10-24 15:07:59', '2025-10-24 15:07:59'),
(13, 15, 'voice-acting', 'Voice Actor [M]', '2025-10-24 15:07:59', '2025-10-24 15:07:59'),
(14, 16, 'music', 'Composer', '2025-10-24 15:07:59', '2025-10-24 15:07:59'),
(16, 19, 'animation', 'Douga', '2025-10-24 15:07:59', '2025-10-24 15:07:59'),
(17, 20, 'animation', 'Douga', '2025-10-24 15:07:59', '2025-10-24 15:07:59'),
(18, 21, 'animation', 'Douga', '2025-10-24 15:07:59', '2025-10-24 15:07:59'),
(19, 22, 'animation', 'Sakkan', '2025-10-24 15:07:59', '2025-10-24 15:07:59'),
(20, 24, 'photography-compositing', 'Compositor', '2025-10-24 15:07:59', '2025-10-24 15:07:59'),
(21, 25, 'photography-compositing', 'Compositor', '2025-10-24 15:07:59', '2025-10-24 15:07:59'),
(22, 26, 'animation', 'Genga', '2025-10-24 15:07:59', '2025-10-24 15:07:59'),
(23, 27, 'animation', 'Genga', '2025-10-24 15:07:59', '2025-10-24 15:07:59'),
(24, 28, 'animation', 'Genga', '2025-10-24 15:07:59', '2025-10-24 15:07:59'),
(25, 29, 'animation', 'Douga, Genga', '2025-10-24 15:07:59', '2025-10-24 15:07:59'),
(26, 30, 'animation', 'Genga', '2025-10-24 15:07:59', '2025-10-24 15:07:59'),
(27, 31, 'animation', 'Genga, Douga', '2025-10-24 15:07:59', '2025-10-24 15:07:59'),
(28, 32, 'background-art', 'Background Artist (2D)', '2025-10-24 15:07:59', '2025-10-24 15:07:59'),
(29, 35, '3d-cgi', '3D Previsual', '2025-10-24 15:07:59', '2025-10-24 15:07:59'),
(30, 36, '3d-cgi', 'Background Artist (3D)', '2025-10-24 15:07:59', '2025-10-24 15:07:59'),
(31, 37, 'editing', 'Editor', '2025-10-24 15:07:59', '2025-10-24 15:07:59'),
(32, 38, 'animation', 'Douga, Shiage', '2025-10-24 15:07:59', '2025-10-24 15:07:59'),
(33, 39, 'background-art', 'Background Artist (2D)', '2025-10-24 15:07:59', '2025-10-24 15:07:59'),
(34, 40, 'voice-acting', 'Voice Actor [M]', '2025-10-24 15:07:59', '2025-10-24 15:07:59'),
(35, 41, 'editing', 'After Effects (MV)', '2025-10-24 15:07:59', '2025-10-24 15:07:59'),
(36, 42, 'voice-acting', 'Voice Actor [M]', '2025-10-24 15:07:59', '2025-10-24 15:07:59'),
(37, 43, 'animation', 'Sakkan', '2025-10-24 15:07:59', '2025-10-24 15:07:59'),
(38, 44, 'background-art', 'Background Artist (2D)', '2025-10-24 15:07:59', '2025-10-24 15:07:59'),
(39, 45, 'music', 'Utaite [F]', '2025-10-24 15:07:59', '2025-10-24 15:07:59'),
(79, 1, 'production', 'Anime Producer', '2025-10-24 15:37:02', '2025-10-24 15:37:02'),
(80, 1, 'sound-design', 'Audio Director', '2025-10-24 15:37:02', '2025-10-24 15:37:02'),
(81, 17, 'animation', 'Douga, ', '2025-10-24 16:24:35', '2025-10-24 16:24:35'),
(82, 17, 'photography-compositing', 'Satsuei Kantoku', '2025-10-24 16:24:35', '2025-10-24 16:24:35'),
(83, 17, 'character-design', 'Illustrator', '2025-10-24 16:24:35', '2025-10-24 16:24:35'),
(84, 47, 'production', 'Project Director', '2025-10-24 16:25:08', '2025-10-24 16:25:08'),
(85, 47, 'animation', 'Animation Director ', '2025-10-24 16:25:08', '2025-10-24 16:25:08'),
(91, 11, 'music', 'Utaite [M]', '2025-10-24 19:00:18', '2025-10-24 19:00:18'),
(92, 49, 'music', 'Singer', '2025-10-28 16:11:27', '2025-10-28 16:11:27'),
(93, 50, 'animation', 'Genga', '2025-10-28 16:17:57', '2025-10-28 16:17:57'),
(96, 51, 'production', 'Assistant Website Developer', '2025-10-31 15:21:43', '2025-10-31 15:21:43');

-- --------------------------------------------------------

--
-- Table structure for table `freelancer_emails`
--

CREATE TABLE `freelancer_emails` (
  `id` int(11) NOT NULL,
  `freelancer_id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `freelancer_emails`
--

INSERT INTO `freelancer_emails` (`id`, `freelancer_id`, `email`, `created_at`, `updated_at`) VALUES
(1, 1, 'kevin@vilostudios.com', '2025-10-24 14:59:45', '2025-10-24 14:59:45'),
(10, 49, 'wonderekk@gmail.com', '2025-10-28 16:11:27', '2025-10-28 16:11:27'),
(11, 50, 'matthewmai146@gmail.com', '2025-10-28 16:17:22', '2025-10-28 16:17:22'),
(13, 51, 'kevnu@kevnu.site', '2025-10-31 15:18:12', '2025-10-31 15:18:12'),
(16, 52, 'soleilhampton@gmail.com', '2025-11-12 15:36:47', '2025-11-12 15:36:47'),
(17, 53, 'jamesbernardbacalandean@gmail.com', '2025-11-12 15:40:01', '2025-11-12 15:40:01'),
(18, 54, 'ANMehu_18@yahoo.com', '2025-11-12 15:40:58', '2025-11-12 15:40:58'),
(19, 55, 'markkorneev@tuta.io', '2025-11-12 15:41:33', '2025-11-12 15:41:33'),
(20, 56, 'rod.luper1@gmail.com', '2025-11-12 15:45:44', '2025-11-12 15:45:44'),
(21, 57, 'suree.yowell@gmail.com', '2025-11-12 15:46:47', '2025-11-12 15:46:47'),
(22, 58, 'jawariaazharhashmi@gmail.com', '2025-11-12 15:47:55', '2025-11-12 15:47:55'),
(23, 59, 'business@phlareox.art', '2025-11-12 15:49:53', '2025-11-12 15:49:53'),
(24, 60, 'SamuelZWatBusiness@Gmail.com', '2025-11-12 15:51:34', '2025-11-12 15:51:34'),
(25, 61, 'manicprice@gmail.com', '2025-11-12 15:53:09', '2025-11-12 15:53:09'),
(26, 62, 'coachjeremydraws@gmail.com', '2025-11-12 15:55:18', '2025-11-12 15:55:18'),
(27, 63, 'art@darkomitev.com', '2025-11-12 15:58:50', '2025-11-12 15:58:50'),
(28, 64, 'bonsama123@gmail.con', '2025-11-12 16:00:22', '2025-11-12 16:00:22'),
(29, 65, 'rlje2801@gmail.com', '2025-11-12 16:04:53', '2025-11-12 16:04:53'),
(30, 66, 'amile1108@gmail.com', '2025-11-12 16:06:22', '2025-11-12 16:06:22'),
(31, 67, 'kaylonsadventureawaits@gmail.com', '2025-11-12 16:06:36', '2025-11-12 16:06:36'),
(32, 68, 'junifrio7@gmail.com', '2025-11-12 16:07:41', '2025-11-12 16:07:41'),
(33, 69, 'lydia.b.philips@gmail.com', '2025-11-12 16:08:20', '2025-11-12 16:08:20'),
(34, 70, 'alekazoo101@gmail.com', '2025-11-12 16:09:25', '2025-11-12 16:09:25'),
(35, 71, 'jonathan.f.aguillon@gmail.com', '2025-11-12 16:09:55', '2025-11-12 16:09:55'),
(36, 72, 'kottonpopart@gmail.com', '2025-11-12 16:10:20', '2025-11-12 16:10:20'),
(37, 73, 'paul.pislea@gmail.com', '2025-11-12 16:13:43', '2025-11-12 16:13:43'),
(38, 74, 'brianyuenart@gmail.com', '2025-11-12 16:14:11', '2025-11-12 16:14:11'),
(39, 75, 'twinngo1699@gmail.com', '2025-11-12 16:14:55', '2025-11-12 16:14:55'),
(40, 76, 'balboa_deborah@outlook.com', '2025-11-12 16:15:44', '2025-11-12 16:15:44'),
(41, 77, 'razzzus@gmail.com', '2025-11-12 16:17:48', '2025-11-12 16:17:48'),
(42, 78, 'eliyana1311@gmail.com', '2025-11-12 16:18:25', '2025-11-12 16:18:25'),
(43, 79, 'leoyuanli98@gmail.com', '2025-11-12 16:24:38', '2025-11-12 16:24:38'),
(44, 80, 'bkarecord14@gmail.com', '2025-11-12 16:27:06', '2025-11-12 16:27:06'),
(45, 81, 'ghitahsaine@gmail.com', '2025-11-12 16:27:33', '2025-11-12 16:27:33'),
(46, 82, 'mohanadahmed726@gmail.com', '2025-11-12 16:27:44', '2025-11-12 16:27:44'),
(47, 83, 'gab.demarigny@gmail.com', '2025-11-12 16:28:55', '2025-11-12 16:28:55'),
(48, 84, 'EPatucci57@gmail.com', '2025-11-12 16:30:26', '2025-11-12 16:30:26'),
(49, 85, 'kingsolomongeri@gmail.com', '2025-11-12 16:31:02', '2025-11-12 16:31:02'),
(50, 86, 'kstith714@gmail.com', '2025-11-12 16:32:03', '2025-11-12 16:32:03'),
(51, 87, 'akeemanese@gmail.com', '2025-11-12 16:34:47', '2025-11-12 16:34:47'),
(52, 88, 'monkuso.103@gmail.com', '2025-11-12 16:35:32', '2025-11-12 16:35:32'),
(53, 89, 'mrunal.khr@gmail.com', '2025-11-12 16:39:23', '2025-11-12 16:39:23'),
(54, 90, 'Buddy2aj@gmail.com', '2025-11-12 16:41:14', '2025-11-12 16:41:14'),
(55, 91, 'saitamasarg@gmail.com', '2025-11-15 11:35:43', '2025-11-15 11:35:43'),
(56, 92, 'viuki.work@gmail.com', '2025-11-15 11:36:58', '2025-11-15 11:36:58'),
(57, 93, 'justinjni@gmail.com', '2025-11-15 11:42:41', '2025-11-15 11:42:41'),
(58, 94, 'connor@halleck.com', '2025-11-16 10:44:28', '2025-11-16 10:44:28'),
(59, 95, 'kellinsproul@zohomail.com', '2025-11-16 10:49:43', '2025-11-16 10:49:43'),
(60, 96, 'gensopictures@gmail.com', '2025-11-22 14:35:17', '2025-11-22 14:35:17'),
(61, 97, 'humzaemail@gmail.com', '2025-11-22 15:14:15', '2025-11-22 15:14:15'),
(62, 98, 'victorbolo.oliveira@gmail.com', '2025-11-22 15:20:31', '2025-11-22 15:20:31'),
(63, 99, 'komeryuu165@gmail.com', '2025-11-22 15:42:13', '2025-11-22 15:42:13');

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` int(11) NOT NULL,
  `role` varchar(255) NOT NULL,
  `branch` varchar(100) NOT NULL,
  `jobType` enum('database','project') NOT NULL DEFAULT 'database',
  `pay` decimal(10,2) DEFAULT NULL,
  `description` text NOT NULL,
  `requirements` text NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `jobs`
--

INSERT INTO `jobs` (`id`, `role`, `branch`, `jobType`, `pay`, `description`, `requirements`, `created_at`, `updated_at`) VALUES
(1, 'Animation Director (作画監督/Sakkan)', 'animation', 'database', NULL, '<p><strong>Position:</strong> Animation Director (作画監督 / Sakkan)</p><p><strong>Company:</strong> Vilostudios</p><p><strong>Type:</strong> Freelance / Remote</p><p><strong>Location:</strong> Worldwide</p><p><br></p><p>Vilostudios is an all-in-one anime and manga production company handling everything from writing and design to animation, voice acting, and sound. We’re building a new model for anime production that values creative freedom, fair compensation, and global collaboration.</p><p><br></p><p>We’re expanding our freelancer database and are seeking experienced <strong>Animation Directors (作画監督 / Sakkan)</strong> to help oversee and refine the quality of animation in our upcoming projects.</p><p><br></p><p><br></p><h3><strong>Responsibilities</strong></h3><ul><li>Supervise the <strong>animation quality</strong> for assigned episodes or sequences.</li><li>Correct key animation (原画修正) to maintain character consistency and visual quality.</li><li>Collaborate with episode directors, key animators, and layout artists to achieve the intended visual direction.</li><li>Provide artistic feedback and technical guidance to the animation team.</li><li>Review animation timing, movement, and expressions for accuracy and impact.</li><li>Communicate effectively within a remote pipeline to meet production deadlines.</li></ul><p>\n</p>', 'Strong understanding of Japanese animation pipelines and production flow.\n\nExcellent drawing and observation skills with a focus on maintaining consistency.\n\nProficiency in Clip Studio Paint (CSP) for revisions and feedback.\n\nAbility to communicate effectively in English or Japanese.\n\nPrior experience as a Genga or clean-up artist preferred.', '2025-10-22 09:55:12', '2025-10-28 15:34:51'),
(3, 'Episode Director (各話演出)', 'production', 'database', NULL, '<p><strong>Position:</strong> Episode Director (Freelance / Remote)</p><p><strong>Company:</strong> Vilostudios</p><p><strong>Type:</strong> Freelance / Remote</p><p><strong>Location:</strong> Worldwide</p><p><br></p><h3><strong>About Us</strong></h3><p>Vilostudios is an all-in-one anime and manga production company handling everything from writing and design to animation, voice acting, and sound. We’re building a new model for anime production that values creative freedom, fair compensation, and global collaboration.</p><p>We’re expanding our freelancer database and are currently seeking skilled <strong>Episode Directors (各話演出)</strong> to join our team for upcoming anime productions.</p><p><br></p><h3><strong>Responsibilities</strong></h3><ul><li>Oversee the direction of assigned episodes, ensuring consistency with the series vision and tone.</li><li>Work closely with storyboard artists, animation directors, and production managers to maintain schedule and quality.</li><li>Review and provide feedback on layout, timing, and visual storytelling.</li><li>Collaborate with other departments (animation, compositing, sound) to bring episodes to completion.</li><li>Maintain clear communication within a remote production pipeline.</li></ul><p><br></p>', '\n\nProven experience as an Episode Director (各話演出) or similar position in anime production.\n\nStrong understanding of anime production workflow and direction techniques.\n\nFamiliarity with Clip Studio Paint (CSP) and digital production tools.\n\nExcellent storytelling sense, pacing, and shot composition skills.\n\nAbility to work within deadlines and collaborate effectively in a remote environment.\n\nEnglish or Japanese proficiency (either is acceptable; bilingual ability is a plus).', '2025-10-28 15:29:18', '2025-10-28 15:29:18'),
(4, 'Key Animator (原画 / Genga)', 'animation', 'database', NULL, '<p><strong>Position:</strong> Key Animator (原画 / Genga)</p><p><strong>Company:</strong> Vilostudios</p><p><strong>Type:</strong> Freelance / Remote</p><p><strong>Location:</strong> Worldwide</p><p><br></p><p><br></p><h3><strong>About Us</strong></h3><p>Vilostudios is an all-in-one anime and manga production company handling everything from writing and design to animation, voice acting, and sound. We’re building a new model for anime production that values creative freedom, fair compensation, and global collaboration.</p><p>We’re expanding our freelancer database and seeking talented <strong>Key Animators (原画 / Genga)</strong> to join our team for upcoming anime projects.</p><p><br></p><p><br></p><h3><strong>Responsibilities</strong></h3><ul><li>Produce high-quality <strong>key animation cuts (原画カット)</strong> that capture character performance, timing, and emotional impact.</li><li>Work closely with <strong>Episode Directors (各話演出)</strong> and <strong>Animation Directors (作画監督)</strong> to maintain visual consistency and dynamic movement.</li><li>Interpret storyboards and layouts into expressive, well-timed key poses.</li><li>Collaborate remotely with the animation team to deliver assigned cuts within the project schedule.</li><li>Incorporate feedback from supervisors and implement corrections efficiently.</li></ul><p><br></p>', 'Proven experience as a Key Animator (原画) or equivalent position in anime production.\n\nStrong understanding of anatomy, perspective, timing, and motion.\n\nFamiliarity with Clip Studio Paint (CSP) or similar 2D digital animation software.\n\nSolid grasp of Japanese animation techniques and workflow.\n\nAbility to take direction and maintain consistent quality across cuts.\n\nEnglish or Japanese proficiency (either is acceptable; bilingual ability preferred).\n\nReliable communication and time management in a remote setting.', '2025-10-28 15:34:10', '2025-10-28 15:34:10'),
(5, 'In-Between Animator (動画 / Douga)', 'animation', 'database', NULL, '<p><strong>Position:</strong> In-Between Animator (動画 / Douga)</p><p><strong>Company:</strong> Vilostudios</p><p><strong>Type:</strong> Freelance / Remote</p><p><strong>Location:</strong> Worldwide</p><p><br></p><p><br></p><p>Vilostudios is an all-in-one anime and manga production company handling everything from writing and design to animation, voice acting, and sound. We’re building a new model for anime production that values creative freedom, fair compensation, and global collaboration.</p><p>We’re expanding our freelancer database and are currently seeking <strong>In-Between Animators (動画 / Douga)</strong> to join our team for upcoming anime projects.</p><p><br></p><h3><strong>Responsibilities</strong></h3><ul><li>Create <strong>in-between frames (動画)</strong> that maintain smooth motion between key animation cuts.</li><li>Ensure consistency in character proportions, line quality, and timing.</li><li>Work closely with <strong>Key Animators (原画)</strong> and <strong>Animation Directors (作画監督)</strong> to deliver accurate and expressive in-betweens.</li><li>Complete assigned cuts according to project deadlines.</li><li>Communicate and collaborate effectively within a remote pipeline.</li></ul><p><br></p>', 'Basic experience or training in 2D animation or Douga work.\n\nStrong drawing fundamentals, with attention to detail and clean linework.\n\nFamiliarity with Clip Studio Paint (CSP) or equivalent digital animation tools.\n\nUnderstanding of Japanese animation workflow and timing sheets (タイムシート).\n\nAbility to accept feedback and make corrections efficiently.\n\nEnglish or Japanese proficiency (either acceptable).\n\nReliable internet connection and good communication for remote coordination.', '2025-10-28 15:36:43', '2025-10-28 15:36:43'),
(6, 'Finisher / Color Artist (仕上げ / Shiage)', 'color-design', 'database', NULL, '<p><strong>Position:</strong> Finisher / Color Artist (仕上げ / Shiage)</p><p><strong>Company:</strong> Vilostudios</p><p><strong>Type:</strong> Freelance / Remote</p><p><strong>Location:</strong> Worldwide</p><p><br></p><p>Vilostudios is a global anime and manga production company focused on reimagining how the industry works. By combining writing, design, animation, and sound within one studio, we create efficient, high-quality productions while supporting fair treatment and flexibility for every creator involved.</p><p>We’re expanding our freelancer database and are seeking skilled <strong>Finishers / Color Artists (仕上げ / Shiage)</strong> to join our team for upcoming anime projects.</p><p><br></p><p><br></p><h3><strong>Responsibilities</strong></h3><ul><li>Perform <strong>coloring, shading, and final finishing</strong> on animation cuts.</li><li>Ensure color consistency across frames and sequences according to the project’s color design and palette.</li><li>Work with <strong>Animation Directors (作画監督)</strong> and <strong>Compositing Artists</strong> to maintain the intended tone and mood.</li><li>Conduct <strong>line cleanup and layer management</strong> to prepare cuts for compositing.</li><li>Deliver finished cuts on schedule while maintaining Vilostudios’ visual quality standards.</li></ul><p><br></p>', 'Experience as a Shiage artist (仕上げ) or similar digital color role in anime production.\n\nStrong understanding of color theory, lighting, and digital paint techniques.\n\nProficiency with Clip Studio Paint (CSP), Photoshop, or equivalent tools.\n\nAttention to detail and consistency in color application and cleanup.\n\nUnderstanding of the anime production pipeline and teamwork with remote staff.\n\nEnglish or Japanese proficiency (either acceptable).\n\nAbility to follow color references and project documentation accurately.', '2025-10-28 15:37:49', '2025-10-28 15:37:49'),
(7, 'In-Between Checker (動画検査 / Douga Kensa)', 'animation', 'database', NULL, '<p><strong>Position:</strong> In-Between Checker (動画検査 / Douga Kensa)</p><p><strong>Company:</strong> Vilostudios</p><p><strong>Type:</strong> Freelance / Remote</p><p><strong>Location:</strong> Worldwide</p><p><br></p><p><br></p><p>Vilostudios is a global anime and manga production company focused on reimagining how the industry works. By combining writing, design, animation, and sound within one studio, we create efficient, high-quality productions while supporting fair treatment and flexibility for every creator involved.</p><p>We’re expanding our freelancer database and are seeking experienced <strong>In-Between Checkers (動画検査 / Douga Kensa)</strong> to ensure the accuracy and consistency of our animation cuts.</p><p><br></p><h3><strong>Responsibilities</strong></h3><ul><li>Review <strong>in-between animation (動画)</strong> for consistency, accuracy, and quality before finishing.</li><li>Check line quality, motion flow, and character proportions according to <strong>key animation (原画)</strong> and <strong>animation director (作画監督)</strong> corrections.</li><li>Identify and correct errors in timing, missing details, or frame continuity.</li><li>Communicate with <strong>Key Animators</strong>, <strong>Douga artists</strong>, and <strong>Animation Directors</strong> to ensure smooth production flow.</li><li>Deliver checked cuts ready for finishing (仕上げ / Shiage) and compositing.</li></ul><p><br></p>', 'Prior experience as a Douga Kensa (動画検査) or senior in-between animator in anime production.\n\nStrong understanding of drawing fundamentals and animation timing.\n\nFamiliarity with Clip Studio Paint (CSP) or other 2D digital animation software.\n\nAttention to detail, accuracy, and consistency in quality control.\n\nUnderstanding of the Japanese anime production pipeline and timing sheets (タイムシート).\n\nEnglish or Japanese proficiency (either acceptable).\n\nAbility to work independently and meet deadlines within a remote workflow.', '2025-10-28 15:40:07', '2025-10-28 15:40:07'),
(8, '3D Director (3D監督 / 3D Kantoku)', '3d-cgi', 'database', NULL, '<p><strong>Position:</strong> 3D Director (3D監督 / 3D Kantoku)</p><p><strong>Company:</strong> Vilostudios</p><p><strong>Type:</strong> Freelance / Remote</p><p><strong>Location:</strong> Worldwide</p><p><br></p><h3><strong>About Us</strong></h3><p>Vilostudios is an all-in-one anime and manga production company, combining traditional 2D animation with cutting-edge 3D workflows. Our remote production pipeline allows talented artists from around the world to contribute to high-quality anime projects while maintaining flexibility and creative freedom.</p><p>We’re expanding our freelancer database and are seeking a skilled <strong>3D Director (3D監督 / 3D Kantoku)</strong> to oversee 3D animation integration and ensure seamless collaboration with our 2D teams.</p><p><br></p><h3><strong>Responsibilities</strong></h3><ul><li>Supervise the <strong>integration of 3D assets and animation</strong> into the production pipeline.</li><li>Coordinate with 2D animation directors, key animators, and compositing teams to ensure consistency in visual style and movement.</li><li>Guide 3D animators in modeling, rigging, animation, lighting, and rendering.</li><li>Ensure proper integration of 3D elements with backgrounds, characters, and effects.</li><li>Review and approve 3D cuts, suggesting corrections for timing, motion, or visual consistency.</li><li>Communicate effectively with the production team in a remote environment to maintain deadlines.</li></ul><p><br></p>', 'Proven experience as a 3D Director (3D監督) or senior 3D animator in anime or similar animation productions.\n\nDeep understanding of 3D animation, rigging, modeling, and rendering pipelines.\n\nProficiency with 3D software such as Maya, Blender, 3ds Max, or equivalent.\n\nStrong understanding of anime aesthetics and how 3D elements integrate with 2D workflows.\n\nAbility to give constructive feedback and maintain quality across multiple scenes.\n\nEnglish or Japanese proficiency (either acceptable; bilingual is a plus).\n\nExperience with remote production pipelines and team coordination.', '2025-10-28 15:41:21', '2025-10-28 15:41:21'),
(9, 'CG Animator (CGアニメーター)', '3d-cgi', 'database', NULL, '<p><strong>Position:</strong> CG Animator (CGアニメーター)</p><p><strong>Company:</strong> Vilostudios</p><p><strong>Type:</strong> Freelance / Remote</p><p><strong>Location:</strong> Worldwide</p><p><br></p><h3><strong>About Us</strong></h3><p>Vilostudios is an all-in-one anime and manga production company combining traditional 2D animation with cutting-edge 3D workflows. Our remote production pipeline allows artists worldwide to contribute to high-quality anime projects while maintaining flexibility and creative freedom.</p><p>We’re expanding our freelancer database and are seeking skilled <strong>CG Animators (CGアニメーター)</strong> to help bring 3D assets to life in our upcoming projects.</p><p><br></p><h3><strong>Responsibilities</strong></h3><ul><li>Animate 3D characters, props, vehicles, or effects according to storyboards and animation direction.</li><li>Collaborate with <strong>3D Director (3D監督)</strong>, <strong>key animators</strong>, and compositing teams to ensure seamless integration with 2D elements.</li><li>Implement motion, timing, and acting that match the intended visual style.</li><li>Participate in rigging, skinning, and animation pipeline optimization when needed.</li><li>Review and adjust animation based on feedback from the 3D Director or Animation Director.</li><li>Work efficiently within deadlines in a remote production environment.</li></ul><p><br></p>', 'Experience as a CG Animator (CGアニメーター) in anime, game, or related animation projects.\n\nStrong understanding of 3D animation principles, timing, and motion.\n\nProficiency with Maya, Blender, 3ds Max, or similar 3D animation software.\n\nKnowledge of integrating 3D animation into 2D pipelines.\n\nAbility to collaborate remotely and communicate effectively.\n\nEnglish or Japanese proficiency (either acceptable; bilingual is a plus).\n\nPortfolio or reel demonstrating 3D animation work in production-quality projects.', '2025-10-28 15:42:22', '2025-10-28 15:42:22'),
(10, '3D Modeler (モデラー)', '3d-cgi', 'database', NULL, '<p><strong>Position:</strong> 3D Modeler (モデラー)</p><p><strong>Company:</strong> Vilostudios</p><p><strong>Type:</strong> Freelance / Remote</p><p><strong>Location:</strong> Worldwide</p><p><br></p><h3><strong>About Us</strong></h3><p>Vilostudios is a full-service anime and manga production company that blends traditional 2D animation with cutting-edge 3D workflows. Our remote production pipeline allows skilled artists from around the world to collaborate on high-quality projects while maintaining flexibility and creative freedom.</p><p>We’re expanding our freelancer database and are seeking experienced <strong>3D Modelers (モデラー)</strong> to create assets for our upcoming anime productions.</p><p><br></p><h3><strong>Responsibilities</strong></h3><ul><li>Design and create <strong>3D models</strong> of characters, props, vehicles, environments, or mechanical objects according to production specifications.</li><li>Work closely with <strong>3D Director (3D監督)</strong> and <strong>CG Animators (CGアニメーター)</strong> to ensure models are animation-ready.</li><li>Implement clean topology suitable for rigging, animation, and rendering.</li><li>Optimize models for performance without sacrificing visual quality.</li><li>Follow style guides, reference sheets, and art direction for consistency.</li><li>Communicate effectively in a remote production environment to meet deadlines.</li></ul><p><br></p>', '\n\nProven experience as a 3D Modeler (モデラー) in anime, game, or animation projects.\n\nProficiency with Maya, Blender, 3ds Max, or similar 3D modeling software.\n\nStrong understanding of topology, UV mapping, and texturing workflow.\n\nAbility to create models that integrate seamlessly into 2D/3D hybrid pipelines.\n\nAttention to detail and ability to maintain visual consistency.\n\nEnglish or Japanese proficiency (either acceptable; bilingual is a plus).\n\nPortfolio or demo reel showing production-quality 3D models.', '2025-10-28 15:43:50', '2025-10-28 15:43:50'),
(11, 'Rigger / Technical Artist (リガー / テクニカルアーティスト)', '3d-cgi', 'database', NULL, '<p><strong>Position:</strong> Rigger / Technical Artist (リガー / テクニカルアーティスト)</p><p><strong>Company:</strong> Vilostudios</p><p><strong>Type:</strong> Freelance / Remote</p><p><strong>Location:</strong> Worldwide</p><p><br></p><p><br></p><h3><strong>About Us</strong></h3><p>Vilostudios is a full-scale anime and manga production company combining traditional 2D animation with modern 3D workflows. Our remote pipeline allows global artists to collaborate on high-quality projects while maintaining flexibility, creative freedom, and fair compensation.</p><p>We’re expanding our freelancer database and are seeking skilled <strong>Riggers / Technical Artists</strong> to support our 3D animation pipeline.</p><p><br></p><h3><strong>Responsibilities</strong></h3><ul><li>Set up <strong>3D character and prop rigs</strong> for animation, including skeletons, controls, and constraints.</li><li>Collaborate with <strong>3D Modelers</strong>, <strong>CG Animators</strong>, and <strong>3D Director (3D監督)</strong> to ensure rigs are intuitive, efficient, and production-ready.</li><li>Develop and maintain technical tools, scripts, or pipelines to optimize workflow.</li><li>Troubleshoot rigging or animation issues and provide technical solutions.</li><li>Ensure rigs integrate smoothly into hybrid 2D/3D pipelines and comply with animation style guides.</li><li>Communicate effectively with the production team in a remote setting.</li></ul><p><br></p>', 'Proven experience as a Rigger / Technical Artist in anime, game, or animation projects.\n\nProficiency with Maya, Blender, 3ds Max, or equivalent rigging and animation software.\n\nKnowledge of scripting (Python, MEL, or similar) for automation and pipeline optimization.\n\nUnderstanding of animation principles, topology, and production pipelines.\n\nAbility to work collaboratively and provide technical guidance.\n\nEnglish or Japanese proficiency (either acceptable; bilingual is a plus).\n\nPortfolio or reel demonstrating rigging or technical work in production-quality projects.', '2025-10-28 15:44:40', '2025-10-28 15:44:40');

-- --------------------------------------------------------

--
-- Table structure for table `recruiter_contacts`
--

CREATE TABLE `recruiter_contacts` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `recruiter_contacts`
--

INSERT INTO `recruiter_contacts` (`id`, `name`, `email`, `notes`, `created_at`, `updated_at`) VALUES
(1, 'Kevin MD', 'kevin@vilostudios.com', 'CEO, Hiring Manager, Website Developer', '2025-10-24 17:42:28', '2025-10-24 17:42:28'),
(2, 'kevnu', 'kevnu@kevnu.site', 'Website Developer Assistant', '2025-10-24 17:42:59', '2025-10-24 17:42:59');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `about_content`
--
ALTER TABLE `about_content`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `section` (`section`),
  ADD KEY `idx_section` (`section`);

--
-- Indexes for table `admin_users`
--
ALTER TABLE `admin_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_email` (`email`);

--
-- Indexes for table `anime_roles`
--
ALTER TABLE `anime_roles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_category` (`category`),
  ADD KEY `idx_english` (`english`);

--
-- Indexes for table `applications`
--
ALTER TABLE `applications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_department` (`department`),
  ADD KEY `idx_email` (`email`);

--
-- Indexes for table `freelancers`
--
ALTER TABLE `freelancers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_department` (`department`);

--
-- Indexes for table `freelancer_departments`
--
ALTER TABLE `freelancer_departments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_freelancer_department` (`freelancer_id`,`department`),
  ADD KEY `idx_freelancer_id` (`freelancer_id`),
  ADD KEY `idx_department` (`department`);

--
-- Indexes for table `freelancer_emails`
--
ALTER TABLE `freelancer_emails`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_freelancer_email` (`freelancer_id`),
  ADD KEY `idx_freelancer_id` (`freelancer_id`),
  ADD KEY `idx_email` (`email`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_branch` (`branch`),
  ADD KEY `idx_jobType` (`jobType`);

--
-- Indexes for table `recruiter_contacts`
--
ALTER TABLE `recruiter_contacts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_name` (`name`),
  ADD KEY `idx_email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `about_content`
--
ALTER TABLE `about_content`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `admin_users`
--
ALTER TABLE `admin_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `anime_roles`
--
ALTER TABLE `anime_roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=93;

--
-- AUTO_INCREMENT for table `applications`
--
ALTER TABLE `applications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=180;

--
-- AUTO_INCREMENT for table `freelancers`
--
ALTER TABLE `freelancers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=100;

--
-- AUTO_INCREMENT for table `freelancer_departments`
--
ALTER TABLE `freelancer_departments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=97;

--
-- AUTO_INCREMENT for table `freelancer_emails`
--
ALTER TABLE `freelancer_emails`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=64;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `recruiter_contacts`
--
ALTER TABLE `recruiter_contacts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `freelancer_emails`
--
ALTER TABLE `freelancer_emails`
  ADD CONSTRAINT `freelancer_emails_ibfk_1` FOREIGN KEY (`freelancer_id`) REFERENCES `freelancers` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
