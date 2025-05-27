import { Prisma } from "../lib/generated/prisma";


export type RoomWithRowAndSeats = Prisma.RoomGetPayload<{
  include: {
    rows: {
        include: {
            seats: true
        }
    }
  };
}>;


export type RowWithSeats = Prisma.RowGetPayload<{
  include: {
    seats: true
  };
}>;

export type MovieExpanded = Prisma.MovieGetPayload<{
  include: {
    genres: {
      include: {
        genre: true
      }
    },
    nation: true
    castings: {
      include: {
        cast: true
      }
    }
  };
}>;

export type MovieCastWithCast = Prisma.MovieCastGetPayload<{
  include: {
    cast: true
  };
}>;

export type PostWithPostCategory = Prisma.ArticleGetPayload<{
  include: {
    postCategory: true
  };
}>;

export type ShowtimeExpanded = Prisma.ShowtimeGetPayload<{
  include: {
    rows: {
      include: {
        seats: true
      }
    },
    brand: {
      include: {
        company: true
      }
    }
    seatPrices: true
    movie: true
    room: true
  }
}>

export type ReviewWithUser = Prisma.ReviewGetPayload<{
  include: {
    user: true
  }
}>

export type UserWithAccount = Prisma.UserGetPayload<{
    include: { accounts: true };
  }>;

export type ArticleWithPostCateGory = Prisma.ArticleGetPayload<{
  include: {
    postCategory: true;
  };
}>;

export type BannerWithMovie = Prisma.BannerGetPayload<{
  include: {
    movie: true;
  };
}>;

export type BookingExpanded = Prisma.BookingGetPayload<{
  include: {
    showtime: {
      include: {
        movie: true;
        room: true;
        brand: true;
      };
    };
    tickets: {
      include: {
        showtimeSeat: true;
      };
    };
  };
}>;