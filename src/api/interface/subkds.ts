// subkds 리스트
export interface ISubkdsListItem {
  receipt_item_contents_idx: number;
  no: number;
  ordered_date: string;
  process_start_date: string;
  product_name: string;
  process_status: number;
  is_btn_hide: number;
}

export interface ISubkdsListReq {
  current_page_number?: number;
  per_page_number?: number;
}

export interface ISubkdsListRes {
  total_count: number;
  list: ISubkdsListItem[];
}

// subkds 처리
export interface ISubkdsProcessReq {
  process_status: number;
}

export interface ISubkdsProcessRes {
  receipt_item_contents_idx: number;
  process_status: number;
}
