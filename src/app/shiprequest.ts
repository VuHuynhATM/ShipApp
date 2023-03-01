export interface ShipRequest {
    label_id?: string,
    partner_id?: string,
    status_id?: number,
    action_time?: string,
    reason_code?: string,
    reason?: string,
    weight?: number,
    fee?: number,
    return_part_package?: number
}