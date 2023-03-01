import { Component, OnInit, Input } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { Reponse } from './reponse';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Order } from './order';
import { Status } from './status';
import { SelectReasonGroup } from './reasongroup';
import { ShipRequest } from './shiprequest';
import { catchError, Observable } from 'rxjs';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styles: [`
        :host ::ng-deep .p-dialog .product-image {
            width: 150px;
            margin: 0 auto 2rem auto;
            display: block;
        }
    `],
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    productDialog!: boolean;

    reponse!: Reponse;

    data!: Object[];

    order!: Order;

    userID!: number;
    
    storeID!: number;

    statuslist!: Status[];

    selectedStatus!: Status;

    reasonlist!: SelectReasonGroup[];

    selectedreason!: string;

    request!: ShipRequest;

    submitted!: boolean;

    constructor(private http: HttpClient, private messageService: MessageService, private confirmationService: ConfirmationService) {
        this.statuslist = [
            { status_code: -1, status: 'Hủy' },
            { status_code: 127, status: 'Shipper (nhân viên lấy/giao hàng) báo không lấy được hàng' },
            { status_code: 9, status: 'Không giao được hàng' },
            { status_code: 7, status: 'Không lấy được hàng' },
            { status_code: 49, status: 'Shipper báo không giao được giao hàng' },
            { status_code: 1, status: 'chưa tiếp nhận' },
            { status_code: 2, status: 'Đã tiếp nhận' },
            { status_code: 12, status: 'Đã điều phối lấy hàng/Đang lấy hàng' },
            { status_code: 123, status: 'Shipper báo đã lấy hàng' },
            { status_code: 8, status: 'Hoãn lấy hàng' },
            { status_code: 128, status: 'Shipper báo delay lấy hàng' },
            { status_code: 3, status: 'Đã lấy hàng/Đã nhập kho' },
            { status_code: 4, status: 'Đã điều phối giao hàng/Đang giao hàng' },
            { status_code: 8, status: 'Hoãn lấy hàng' },
            { status_code: 10, status: 'Delay giao hàng' },
            { status_code: 410, status: 'Shipper báo delay giao hàng' },
            { status_code: 5, status: 'Đã giao hàng/Chưa đối soát' },
            { status_code: 45, status: 'Shipper báo đã giao hàng' },
            { status_code: 6, status: 'Đã đối soát' },
            { status_code: 11, status: 'Đã đối soát công nợ trả hàng' },
            { status_code: 13, status: 'Đơn hàng bồi hoàn' },
            { status_code: 20, status: 'Đang trả hàng (COD cầm hàng đi trả)' },
            { status_code: 21, status: 'Đã trả hàng (COD đã trả xong hàng)' },
        ];
        this.reasonlist = [
            {
                label: 'Không ', value: 'Không ',
                items: [
                    { value: '', label: 'trống' }
                ]
            },
            {
                label: 'Lý do chậm lấy hàng', value: '8',
                items: [
                    { value: 'Nhà cung cấp (NCC) hẹn lấy vào ca tiếp theo-' + 100, label: 'Nhà cung cấp (NCC) hẹn lấy vào ca tiếp theo' },
                    { value: 'GHTK không liên lạc được với NCC-' + 101, label: 'GHTK không liên lạc được với NCC' },
                    { value: 'NCC chưa có hàng-' + 102, label: 'NCC chưa có hàng' },
                    { value: 'NCC đổi địa chỉ-' + 103, label: 'NCC đổi địa chỉ' },
                    { value: 'NCC hẹn ngày lấy hàng-' + 104, label: 'NCC hẹn ngày lấy hàng' },
                    { value: 'GHTK quá tải, không lấy kịp-' + 105, label: 'GHTK quá tải, không lấy kịp' },
                    { value: 'Do điều kiện thời tiết, khách quan-' + 106, label: 'Do điều kiện thời tiết, khách quan' },
                    { value: 'Lý do khác-' + 107, label: 'Lý do khác' },
                ]
            },
            {
                label: 'Lý do không lấy được hàng', value: '7',
                items: [
                    { value: 'Địa chỉ ngoài vùng phục vụ-' + 110, label: 'Địa chỉ ngoài vùng phục vụ' },
                    { value: 'Hàng không nhận vận chuyển-' + 111, label: 'Hàng không nhận vận chuyển' },
                    { value: 'NCC báo hủy-' + 112, label: 'NCC báo hủy' },
                    { value: 'NCC hoãn/không liên lạc được 3 lần-' + 113, label: 'NCC hoãn/không liên lạc được 3 lần' },
                    { value: 'Lý do khác-' + 114, label: 'Lý do khác' },
                    { value: 'Đối tác hủy đơn qua API-' + 115, label: 'Đối tác hủy đơn qua API' },
                ]
            },
            {
                label: 'Lý do chậm giao hàng', value: 'us',
                items: [
                    { value: 'GHTK quá tải, giao không kịp-' + 120, label: 'GHTK quá tải, giao không kịp' },
                    { value: 'Người nhận hàng hẹn giao ca tiếp theo-' + 121, label: 'Người nhận hàng hẹn giao ca tiếp theo' },
                    { value: 'Không gọi được cho người nhận hàng-' + 122, label: 'Không gọi được cho người nhận hàng' },
                    { value: 'Người nhận hàng hẹn ngày giao-' + 123, label: 'Người nhận hàng hẹn ngày giao' },
                    { value: 'Người nhận hàng chuyển địa chỉ nhận mới-' + 124, label: 'Người nhận hàng chuyển địa chỉ nhận mới' },
                    { value: 'Địa chỉ người nhận sai, cần NCC check lại-' + 125, label: 'Địa chỉ người nhận sai, cần NCC check lại' },
                    { value: 'Do điều kiện thời tiết, khách quan-' + 126, label: 'Do điều kiện thời tiết, khách quan' },
                    { value: 'Lý do khác-' + 127, label: 'Lý do khác' },
                    { value: 'Đối tác hẹn thời gian giao hàng-' + 128, label: 'Đối tác hẹn thời gian giao hàng' },
                    { value: 'Không tìm thấy hàng-' + 129, label: 'Không tìm thấy hàng' },
                    { value: 'SĐT người nhận sai, cần NCC check lại-' + 1200, label: 'SĐT người nhận sai, cần NCC check lại' },
                ]
            },
            {
                label: 'Lý do không giao được hàng', value: '9',
                items: [
                    { value: 'Người nhận không đồng ý nhận sản phẩm-' + 130, label: 'Người nhận không đồng ý nhận sản phẩm' },
                    { value: 'Không liên lạc được với KH 3 lần-' + 131, label: 'Không liên lạc được với KH 3 lần' },
                    { value: 'KH hẹn giao lại quá 3 lần-' + 132, label: 'KH hẹn giao lại quá 3 lần' },
                    { value: 'Shop báo hủy đơn hàng-' + 133, label: 'Shop báo hủy đơn hàng' },
                    { value: 'Lý do khác-' + 134, label: 'Lý do khác' },
                    { value: 'Đối tác hủy đơn qua API-' + 135, label: 'Đối tác hủy đơn qua API' },
                ]
            },
            {
                label: 'Lý do delay trả hàng', value: 'dl',
                items: [
                    { value: 'NCC hẹn trả ca sau-' + 140, label: 'NCC hẹn trả ca sau' },
                    { value: 'Không liên lạc được với NCC-' + 141, label: 'Không liên lạc được với NCC' },
                    { value: 'NCC không có nhà-' + 142, label: 'NCC không có nhà' },
                    { value: 'NCC hẹn ngày trả-' + 143, label: 'NCC hẹn ngày trả' },
                    { value: 'Lý do khác-' + 144, label: 'Lý do khác' }
                ]
            }
        ]
    }

    ngOnInit() {
        //this.productService.getProducts().then(data => this.products = data);
        this.getData();
    }
    getData() {
        return this.http.get<Reponse>('http://esmpfree-001-site1.etempurl.com/api/Order/get_order_status_ship').subscribe((data) => {
            //console.log(data);
            this.reponse = data;
            this.data != data.data;
            console.log(this.reponse);
        })
    }
    searchData() {
        if (this.userID != null && this.storeID != null) {
            return this.http.get<Reponse>('http://esmpfree-001-site1.etempurl.com/api/Order/get_order_status?userID=' + this.userID + '&storeID=' + this.storeID).subscribe((data) => {
                //console.log(data);
                this.reponse = data;
                this.data != data.data;
                console.log(this.reponse);
            })
        } else if (this.userID != null) {
            return this.http.get<Reponse>('http://esmpfree-001-site1.etempurl.com/api/Order/get_order_status?userID=' + this.userID).subscribe((data) => {
                //console.log(data);
                this.reponse = data;
                this.data != data.data;
                console.log(this.reponse);
            })
        } else if (this.storeID != null) {
            return this.http.get<Reponse>('http://esmpfree-001-site1.etempurl.com/api/Order/get_order_status?storeID=' + this.storeID).subscribe((data) => {
                //console.log(data);
                this.reponse = data;
                this.data != data.data;
                console.log(this.reponse);
            })
        }else{
            return this.http.get<Reponse>('http://esmpfree-001-site1.etempurl.com/api/Order/get_order_status').subscribe((data) => {
                //console.log(data);
                this.reponse = data;
                this.data != data.data;
                console.log(this.reponse);
            })
        }
        return;

    }
    editProduct(product: Order) {
        this.order = { ...product };
        this.productDialog = true;
    }
    hideDialog() {
        this.productDialog = false;
        this.submitted = false;
    }
    savefunc() {
        console.log(this.selectedStatus);
        console.log(this.selectedreason);
        let currentDate = new Date();
        var hour = currentDate.getUTCHours() + 7;
        currentDate.setUTCHours(hour);
        const reasontxt = this.selectedreason.split('-')[0];
        let reason_code = this.selectedreason.split('-')[1];
        if (reason_code == undefined) {
            reason_code = "";
        }
        this.request = {
            action_time: new Date(currentDate).toISOString(),
            fee: 0,
            label_id: this.order.orderShip?.labelID,
            partner_id: this.order.orderID + '',
            reason: reasontxt,
            reason_code: reason_code,
            return_part_package: 0,
            status_id: this.selectedStatus.status_code,
            weight: 0,
        }
        const headers = { 'content-type': 'application/json' }
        const body = JSON.stringify(this.request);
        console.log(this.request);
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: 'my-auth-token'
            })
        };
        this.http.post('http://esmpfree-001-site1.etempurl.com/api/Ship', this.request, httpOptions).subscribe(data => {
            console.log(data);
        });
        this.hideDialog();
        this.getData();
    }
}
