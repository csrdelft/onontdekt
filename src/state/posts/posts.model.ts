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
  uid_naam: string;
  verwijderd: boolean;
  wacht_goedkeuring: boolean;
}
