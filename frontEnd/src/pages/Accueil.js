import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchCategories, fetchServices } from "../services/api";
import "../Styles/Accueil.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL ?? "http://127.0.0.1:8000/api";
const BACKEND_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, "");

const PROMO_FEATURES = [
  {
    icon: "fas fa-check-circle",
    title: "Prestataires verifies",
    description:
      "Explorez de vraies categories issues de notre base et trouvez plus vite les bons profils.",
  },
  {
    icon: "fas fa-clock",
    title: "Reservation rapide",
    description:
      "Parcourez les services disponibles et entrez en contact avec les prestataires en quelques clics.",
  },
  {
    icon: "fas fa-star",
    title: "Avis authentiques",
    description:
      "Comparez les profils, les prestations et les notes avant de reserver votre coup de coeur.",
  },
];

const HERO_GALLERY_GROUPS = [
  {
    alt: "Photographe professionnel",
    images: [
      "photo.photographie/photographie7.jpg",
      "photo.photographie/photographie8.jpg",
      "photo.photographie/photographie9.jpg",
      "photo.photographie/photograph2.jpg",
    ],
  },
  {
    alt: "Traiteur gastronomique",
    images: [
      "photo.traiteur/Traiteur3.jpg",
      "photo.hanna/hanna.jpg",
      "photo.Mequeupe/makeup3.jpg",
      "photo.Dj/Dj.jpg",
    ],
  },
  {
    alt: "Salle de reception",
    images: [
      "photo.salle/salle11.jpg",
      "photo.salle/salle12.jpg",
      "photo.salle/salle8.jpg",
      "photo.salle/salle6.jpg",
    ],
  },
  {
    alt: "Tayfer traditionnel",
    images: [
      "photo.tyafar/image2.jpg",
      "photo.tyafar/image6.jpg",
      "photo.tyafar/tyafar1.jpg",
      "photo.tyafar/tyafar2.jpg",
    ],
  },
];

const CATEGORY_IMAGE_FALLBACKS = {
  negafa: "photo.negafa/nagafa1.jpg",
  "lieux-de-reception": "photo.salle/salle11.jpg",
  traiteur: "photo.traiteur/Traiteur3.jpg",
  photographie: "photo.photographie/photographie7.jpg",
  bijoux: "photo.bijoux/bijoux4.jpg",
  tayfer: "photo.tyafar/tyafar1.jpg",
  "dj-orchestre": "photo.Dj/Dj.jpg",
  "dj-&-orchestre": "photo.Dj/Dj.jpg",
};

const buildStorageUrl = (path) => `${BACKEND_BASE_URL}/storage/${path}`;

const resolveMediaUrl = (path) => {
  if (!path) {
    return "";
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  if (path.startsWith("/storage/")) {
    return `${BACKEND_BASE_URL}${path}`;
  }

  if (path.startsWith("storage/")) {
    return `${BACKEND_BASE_URL}/${path}`;
  }

  if (path.startsWith("/")) {
    return `${BACKEND_BASE_URL}${path}`;
  }

  return buildStorageUrl(path);
};

const getCategoryImage = (category) => {
  const fallbackPath =
    CATEGORY_IMAGE_FALLBACKS[category?.slug] ??
    CATEGORY_IMAGE_FALLBACKS[category?.name?.toLowerCase().replace(/\s+/g, "-")];

  if (!category?.image) {
    return fallbackPath ? buildStorageUrl(fallbackPath) : "";
  }

  if (category.image.startsWith("/images/")) {
    return fallbackPath ? buildStorageUrl(fallbackPath) : resolveMediaUrl(category.image);
  }

  return resolveMediaUrl(category.image);
};

function Accueil() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [servicesTotal, setServicesTotal] = useState(0);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [heroSlideIndex, setHeroSlideIndex] = useState(0);

  useEffect(() => {
    const loadHomepageData = async () => {
      try {
        const [servicesResponse, categoriesResponse] = await Promise.all([
          fetchServices({ per_page: 8 }),
          fetchCategories(),
        ]);

        const serviceItems = Array.isArray(servicesResponse?.data)
          ? servicesResponse.data
          : [];
        const categoryItems = Array.isArray(categoriesResponse) ? categoriesResponse : [];

        setServices(serviceItems);
        setServicesTotal(Number(servicesResponse?.total || serviceItems.length || 0));
        setCategories(categoryItems);
      } catch (error) {
        setServices([]);
        setCategories([]);
        setServicesTotal(0);
      }
    };

    loadHomepageData();
  }, []);

  const featuredCategories = useMemo(() => categories.slice(0, 8), [categories]);
  const marqueeCategories = useMemo(
    () => (featuredCategories.length > 1 ? [...featuredCategories, ...featuredCategories] : featuredCategories),
    [featuredCategories]
  );
  const uniqueCitiesCount = useMemo(() => {
    const cities = services
      .map((service) => service?.provider?.city || service?.provider?.address)
      .filter(Boolean);

    return new Set(cities.map((city) => city.toLowerCase())).size;
  }, [services]);

  const sliderImages = useMemo(() => {
    const fromServices = services
      .map((service) => service?.image)
      .filter(Boolean);
    const fromCategories = featuredCategories
      .map((category) => category?.image)
      .filter(Boolean);

    return [...new Set([...fromServices, ...fromCategories])].slice(0, 4);
  }, [featuredCategories, services]);

  const heroGalleryItems = useMemo(
    () =>
      HERO_GALLERY_GROUPS.map((group) => ({
        alt: group.alt,
        images: group.images.map((imagePath) => buildStorageUrl(imagePath)),
      })),
    []
  );

  useEffect(() => {
    if (sliderImages.length <= 1) {
      setActiveSlideIndex(0);
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setActiveSlideIndex((currentIndex) => (currentIndex + 1) % sliderImages.length);
    }, 4000);

    return () => window.clearInterval(intervalId);
  }, [sliderImages]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setHeroSlideIndex((currentIndex) => currentIndex + 1);
    }, 4000);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <div className="home-wrapper">
      <section className="organizer-section">
        <div className="organizer-container">
          <div className="organizer-content">
            <h2 className="organizer-title">Ghir B&apos;click, un mariage magique</h2>
            <p className="organizer-description">
              Decouvrez une plateforme dediee aux futurs maries. Accedez a une
              selection exclusive de prestataires de confiance et organisez
              chaque detail de votre ceremonie avec clarte et elegance.
            </p>
            <Link to="/services" className="organizer-btn">
              Lancez une recherche
            </Link>
            <p className="organizer-subtext">
              Etes-vous un prestataire ? <Link to="/connexion">Rejoignez-nous ici !</Link>
            </p>
          </div>

          <div className="organizer-gallery">
            <div className="collage-grid">
              {heroGalleryItems.map((item) => (
                <div className="collage-item" key={item.alt}>
                  <img
                    src={item.images[heroSlideIndex % item.images.length]}
                    alt={item.alt}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="stats-bar">
          <div className="stat-item">
            <span className="stat-icon" style={{ color: "#9c7c3a" }}>
              <i className="fas fa-layer-group"></i>
            </span>
            <div className="stat-info">
              <h3 className="stat-number">{servicesTotal || services.length}</h3>
              <p className="stat-label">Services</p>
            </div>
          </div>
          <div className="stat-item">
            <span className="stat-icon" style={{ color: "#9c7c3a" }}>
              <i className="fas fa-list"></i>
            </span>
            <div className="stat-info">
              <h3 className="stat-number">{categories.length}</h3>
              <p className="stat-label">Categories</p>
            </div>
          </div>
          <div className="stat-item">
            <span className="stat-icon" style={{ color: "#9c7c3a" }}>
              <i className="fas fa-map-marker-alt"></i>
            </span>
            <div className="stat-info">
              <h3 className="stat-number">{uniqueCitiesCount}</h3>
              <p className="stat-label">Villes</p>
            </div>
          </div>
          <div className="stat-item">
            <span className="stat-icon" style={{ color: "#9c7c3a" }}>
              <i className="fas fa-star"></i>
            </span>
            <div className="stat-info">
              <h3 className="stat-number">{featuredCategories.length}</h3>
              <p className="stat-label">Univers en avant</p>
            </div>
          </div>
        </div>
      </section>

      <section className="categories-showcase-section">
        <div className="home-section-shell">
          <div className="home-section-heading">
            <span className="section-kicker">Types d&apos;evenements</span>
            <h2 className="section-title">Nous couvrons divers types d&apos;evenements</h2>
            <p className="section-description">
              Explorez notre collection de categories pour trouver rapidement les
              prestataires adaptes a votre ambiance et a vos envies.
            </p>
          </div>

          <div className="categories-rail">
            <div
              className={`categories-track ${
                featuredCategories.length > 1 ? "is-animated" : ""
              }`}
              role="list"
            >
              {marqueeCategories.map((category, index) => {
                const isDuplicate = index >= featuredCategories.length;

                return (
                  <Link
                    key={`${category.id}-${index}`}
                    to={`/services?category=${category.slug}`}
                    className="category-showcase-card"
                    aria-hidden={isDuplicate}
                    tabIndex={isDuplicate ? -1 : 0}
                  >
                    <div className="category-showcase-image">
                      <img
                        src={getCategoryImage(category)}
                        alt={category.name}
                        loading="lazy"
                        onError={(event) => {
                          const fallbackSrc = getCategoryImage({
                            ...category,
                            image: "",
                          });

                          if (fallbackSrc && event.currentTarget.src !== fallbackSrc) {
                            event.currentTarget.src = fallbackSrc;
                          }
                        }}
                      />
                    </div>
                    <div className="category-showcase-content">
                      <h3 className="category-showcase-name">{category.name}</h3>
                      <p className="category-showcase-count">
                        {category.services_count} service
                        {category.services_count > 1 ? "s" : ""}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="homepage-promo-section">
        <div className="home-section-shell homepage-promo-card">
          <div className="homepage-promo-visual">
            {sliderImages.length > 0 ? (
              <>
                {sliderImages.map((image, index) => (
                  <img
                    key={`${image}-${index}`}
                    src={resolveMediaUrl(image)}
                    alt="Prestations mariage"
                    className={`homepage-promo-slide ${
                      index === activeSlideIndex ? "is-active" : ""
                    }`}
                  />
                ))}
              </>
            ) : (
              <img
                src={buildStorageUrl("photo.salle/salle11.jpg")}
                alt="Prestations mariage"
                className="homepage-promo-slide is-active"
              />
            )}
          </div>

          <div className="homepage-promo-copy">
            <h2 className="promotional-title">Pourquoi choisir notre plateforme</h2>
            <div className="promotional-description">
              <strong>Nos univers les plus demandes pour un mariage d&apos;exception</strong>
              <span>
                Explorez 7 categories et trouvez les prestations les plus
                recherchees, de lieux de reception aux services complementaires
                pour votre grand jour.
              </span>
            </div>

            <ul className="promotional-features">
              {PROMO_FEATURES.map((feature) => (
                <li key={feature.title}>
                  <span className="feature-icon">
                    <i className={feature.icon}></i>
                  </span>
                  <div>
                    <strong>{feature.title}</strong>
                    <p>{feature.description}</p>
                  </div>
                </li>
              ))}
            </ul>

            <Link to="/services" className="promotional-btn">
              Explorer les services
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

export default Accueil;
