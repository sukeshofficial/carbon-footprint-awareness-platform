import React from 'react';
import PropTypes from 'prop-types';
import { Car, Utensils, Zap, ShoppingBag, Info } from 'lucide-react';

const CategoryExplanationCard = ({ category, reason }) => {
  const getCategoryConfig = () => {
    switch (category?.toLowerCase()) {
      case 'transport':
        return { icon: Car, color: 'bg-blue-50 text-blue-600', border: 'border-blue-100', label: 'Transport' };
      case 'food':
        return { icon: Utensils, color: 'bg-orange-50 text-orange-600', border: 'border-orange-100', label: 'Food' };
      case 'energy':
        return { icon: Zap, color: 'bg-amber-50 text-amber-600', border: 'border-amber-100', label: 'Energy' };
      case 'shopping':
        return { icon: ShoppingBag, color: 'bg-purple-50 text-purple-600', border: 'border-purple-100', label: 'Shopping' };
      default:
        return { icon: Info, color: 'bg-slate-50 text-slate-600', border: 'border-slate-100', label: category };
    }
  };

  const config = getCategoryConfig();
  const Icon = config.icon;

  return (
    <div className={`flex items-start gap-4 p-4 bg-white border ${config.border} rounded-4xl hover:shadow-sm transition-shadow`}>
      <div className={`p-2 rounded-lg ${config.color}`}>
        <Icon size={20} />
      </div>
      <div>
        <h4 className="text-base font-semibold text-slate-800 mb-1">{config.label}</h4>
        <p className="text-slate-600 text-sm font-normal leading-relaxed">{reason}</p>
      </div>
    </div>
  );
};

CategoryExplanationCard.propTypes = {
  category: PropTypes.string.isRequired,
  reason: PropTypes.string.isRequired
};

export default CategoryExplanationCard;
