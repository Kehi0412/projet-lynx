export interface Audit {
  creer_par?: string;
  cree_le?: string;
  modifier_par?: string;
  modifier_le?: string;
  supprimer: boolean;
}

export interface Annee extends Audit {
  id_ann: number;
  lib_ann: string;
  thm_ann: string;
}

export interface Categorie extends Audit {
  id_cat: number;
  lib_cat: string;
}

export interface TypeMission extends Audit {
  id_typ: number;
  lib_typ: string;
}
export interface Agent extends Audit {
  id_miss: number;
  cod_miss: string;
  d_db_miss: string;
  d_fin_miss: string;
}

export interface Recommandation extends Audit {
  id_rec: number;
  lib_rec: string;
  const_rec: string;
  cse_const_rec: string;
  d_db_rec: string;
  d_fin_rec: string;
  ob_rec: string;
  pr_att_rec: string;
}

export interface Fichier extends Audit {
  id_fich: number;
  nm_fich: string;
  ext_fich: string;
  id_rec: number;
  taille?: number;
  contenu?: string; // contenu du fichier (en mémoire pour l'instant)
}

export type ParamKey =
  'annee' | 'categorie' | 'typemission' | 'agent' | 'recommandation' | 'fichier';

export interface ParamField {
  name: string;
  label: string;
  type?: 'text' | 'date' | 'number' | 'select';
  readonly?: boolean;
  source?: { key: ParamKey; id: string; label: string };
}

export interface ParamConfig {
  key: ParamKey;
  label: string;
  id: string;
  upload?: boolean;
  fields: ParamField[];
}

export const PARAM_CONFIGS: ParamConfig[] = [
  {
    key: 'annee',
    label: "Année d'exercice",
    id: 'id_ann',
    fields: [
      { name: 'lib_ann', label: 'Libellé' },
      { name: 'thm_ann', label: 'Thème' },
    ],
  },
  {
    key: 'categorie',
    label: 'Catégorie',
    id: 'id_cat',
    fields: [{ name: 'lib_cat', label: 'Libellé' }],
  },
  {
    key: 'typemission',
    label: 'Type de mission',
    id: 'id_typ',
    fields: [{ name: 'lib_typ', label: 'Libellé' }],
  },

  {
    key: 'agent',
    label: 'Agent',
    id: 'id_miss',
    fields: [
      { name: 'cod_miss', label: 'Code' },
      { name: 'd_db_miss', label: 'Date début', type: 'date' },
      { name: 'd_fin_miss', label: 'Date fin', type: 'date' },
    ],
  },

  {
    key: 'recommandation',
    label: 'Recommandation',
    id: 'id_rec',
    fields: [
      { name: 'lib_rec', label: 'Libellé' },
      { name: 'const_rec', label: 'Constat' },
      { name: 'cse_const_rec', label: 'Cause du constat' },
      { name: 'd_db_rec', label: 'Date début', type: 'date' },
      { name: 'd_fin_rec', label: 'Date fin', type: 'date' },
      { name: 'ob_rec', label: 'Observation' },
      { name: 'pr_att_rec', label: 'Priorité' },
    ],
  },

  {
    key: 'fichier',
    label: 'Fichier',
    id: 'id_fich',
    upload: true,
    fields: [
      { name: 'nm_fich', label: 'Nom du fichier', readonly: true },
      { name: 'ext_fich', label: 'Extension', readonly: true },
      {
        name: 'id_rec',
        label: 'Recommandation',
        type: 'select',
        source: { key: 'recommandation', id: 'id_rec', label:  'id_rec' },
      },
    ],
  },
];
