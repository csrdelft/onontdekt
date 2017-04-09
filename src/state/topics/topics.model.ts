export interface ForumTopic {
  UUID: string;
  attributes_received: any;
  belangrijk: any;
  datum_tijd: Date;
  draad_id: number;
  eerste_post_plakkerig: boolean;
  forum_id: number;
  forum_titel?: string;
  gedeeld_met: any;
  gesloten: boolean;
  laatst_gewijzigd: Date;
  laatste_post?: ForumPost;
  laatste_post_id: number;
  laatste_wijziging_uid: string;
  laatste_wijziging_naam: string;
  ongelezen?: number;
  pagina_per_post: boolean;
  plakkerig: boolean;
  titel: string;
  uid: string;
  verwijderd: boolean;
  wacht_goedkeuring: boolean;
}

export interface ForumPost {
  UUID: string;
  attributes_received: any;
  auteur_ip: string;
  bewerkt_tekst: any;
  datum_tijd: Date;
  draad_id: number;
  gefilterd: any;
  laatst_gewijzigd: Date;
  post_id: number;
  tekst: string;
  uid: string;
  uid_naam?: string;
  verwijderd: boolean;
  wacht_goedkeuring: boolean;
}
