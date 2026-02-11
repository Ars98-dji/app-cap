/**
 * Composant pour afficher un avis important sur le site
 */

import { useState } from 'react';

export default function ImportantNotice() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-xl p-6 shadow-lg relative">
      {/* Bouton de fermeture */}
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-3 right-3 text-white/80 hover:text-white transition-colors"
        aria-label="Fermer l'avis"
      >
        <span className="material-symbols-outlined text-xl">close</span>
      </button>

      <div className="pr-8">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-2xl">info</span>
          Avis Important
        </h3>
        
        <div className="space-y-3 text-sm leading-relaxed">
          <p>
            Pour tout retrait d'acte académique au rectorat, la quittance se paie désormais dans le compte du trésor intitulé : <strong>Rectorat/ Produits accessoires</strong>.
          </p>
          
          <p>
            Les frais du Rectorat se paieront désormais sur le compte du trésor du Rectorat.
          </p>

          <div className="mt-5 pt-4 border-t border-white/20">
            <p className="font-semibold mb-3">Numéro de compte :</p>
            <div className="bg-white/15 backdrop-blur-sm rounded-lg p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-xs text-white/70 mb-1">Code banque</div>
                  <div className="font-bold text-lg">BJ060</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-white/70 mb-1">Guichet</div>
                  <div className="font-bold text-lg">01001</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-white/70 mb-1">N° de compte</div>
                  <div className="font-bold text-lg">000001044722</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-white/70 mb-1">RIB</div>
                  <div className="font-bold text-lg">50</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
