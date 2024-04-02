// Services.js

import React from 'react';
import { Link } from 'react-router-dom';
import './Services.css';

const servicesData = [
  {
    id: 1,
    title: "Grooming",
    description: "Professional grooming services to keep your pet looking sharp.",
    price: "Starting at £20"
  },
  {
    id: 2,
    title: "Pet Sitting",
    description: "Trusted sitters to take care of your pet while you're away.",
    price: "Starting at £25 per day"
  },
  {
    id: 3,
    title: "Dog Walking",
    description: "Regular walks to maintain your dog's wellbeing and provide joyful exercise",
    price: "Starting at £20 per day"
  }

];

const Services = () => {
    return (
        <div className="services-container">
            <h1>Our Services</h1>
            <div className="services-grid">
                {servicesData.map((service) => (
                    <div className="service-card" key={service.id}>
                        <h2>{service.title}</h2>
                        <p>{service.description}</p>
                        <p className="service-price">{service.price}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Services;
