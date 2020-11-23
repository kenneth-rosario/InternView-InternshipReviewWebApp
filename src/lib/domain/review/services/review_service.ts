import * as i from '../interfaces'
import * as e from '../entities'
import {inject, injectable} from 'inversify'
import { R_TYPES } from '../types'
import * as infrastruct from '../../../infrastructure'
import 'reflect-metadata'
import { IStudent } from '../../student'
import { ERROR_MESSAGE, OK_MESSAGE } from '../../../application/constants'


@injectable()
class StudentService implements i.IReviewService {
    
    private readonly _reviewRepo: i.IReviewRepository
    private readonly _reviewFactory: i.IReviewFactory

    constructor(
        @inject(R_TYPES.IReviewFactory) reviewFactory: i.IReviewFactory,
        @inject(R_TYPES.IReviewRepository) reviewRepository: i.IReviewRepository
    ) {
        this._reviewRepo = reviewRepository,
        this._reviewFactory = reviewFactory
    }

    async createReview(input_data: e.IReview, author: IStudent) {
        
        if (!author) {
            return {status:ERROR_MESSAGE, message:"No author"}
        }

        // Fill data with auth users info, can bemoved to review instance
        input_data.author = author
        input_data.studyProgram = author.studyprogram
        input_data.university = author.university
        
        let review = null

        try {
            review = this._reviewFactory.makeInstance(input_data)
        }
        catch(e) {
            return {status: ERROR_MESSAGE, message: e.message}
        }

        const output = await this._reviewRepo.createReview(review)

        if (!output) {
            return {status:ERROR_MESSAGE, message:"Unable to create"}
        }
        
        return {status:OK_MESSAGE, message: "review created successfully", data:output}
    }
    
}

export default StudentService